/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Direction } from '@angular/cdk/bidi';
import { Subject } from 'rxjs';
import { DndContainerRef } from '../drag-drop-ref/dnd-container-ref';
import { DragRefInternal as DragRef } from '../drag-drop-ref/drag-ref';
import { DropListContainerRef } from '../drag-drop-ref/drop-list-container-ref';
import { DragDropRegistry } from '../drag-drop-registry';
import { combineTransforms } from '../drag-styling';
import { CachedItemPosition } from '../drop-container.interface';
import { findIndex } from '../utils';
import { adjustClientRect, getMutableClientRect, isInsideClientRect, } from '../utils/client-rect';
import { moveItemInArray } from '../utils/drag-utils';
import { PositionStrategy } from './position-strategy';

export class FlexRowSortPositionStrategy implements PositionStrategy {
  /** Cache of the dimensions of all the items inside the container. */
  _itemPositions: CachedItemPosition[] = [];

  /**
   * Keeps track of the item that was last swapped with the dragged item, as well as what direction
   * the pointer was moving in when the swap occured and whether the user's pointer continued to
   * overlap with the swapped item after the swapping occurred.
   */
  _previousSwap = {drag: null as DragRef | null, delta: 0, overlaps: false};

  get _direction(): Direction {
    return this.dropContainerRef._direction;
  }

  get _orientation() {
    return this.dropContainerRef._orientation;
  }

  get _activeDraggables() {
    return this.dropContainerRef._activeDraggables;
  }

  get sorted(): Subject<{
    previousIndex: number,
    currentIndex: number,
    container: DndContainerRef,
    item: DragRef
  }> {
    return (this.dropContainerRef as DropListContainerRef).sorted;
  }

  public dropContainerRef: DndContainerRef;

  constructor(public _dragDropRegistry: DragDropRegistry<DragRef, DndContainerRef>) {
  }

  adjustItemPositions(cb: (clientRect: ClientRect) => void) {
    // Since we know the amount that the user has scrolled we can shift all of the
    // client rectangles ourselves. This is cheaper than re-measuring everything and
    // we can avoid inconsistent behavior where we might be measuring the element before
    // its position has changed.
    this._itemPositions.forEach(({clientRect}) => cb(clientRect));
  }

  repositionDraggingItem() {
    // We need two loops for this, because we want all of the cached
    // positions to be up-to-date before we re-sort the item.
    this._itemPositions.forEach(({drag}) => {
      if (this._dragDropRegistry.isDragging(drag)) {
        // We need to re-sort the item manually, because the pointer move
        // events won't be dispatched while the user is scrolling.
        drag._sortFromLastPointerPosition();
      }
    });
  }

  _translateItem(offsetItem: CachedItemPosition, isDragItem: boolean, siblingOffsetX: number,
                 siblingOffsetY: number) {
    offsetItem.offsetX += siblingOffsetX;
    offsetItem.offsetY += siblingOffsetY;

    (isDragItem ? offsetItem.drag.getPlaceholderElement() : offsetItem.drag.getRootElement())
      .style.transform = combineTransforms(
      `translate3d(${offsetItem.offsetX}px, ${offsetItem.offsetY}px, 0)`,
      offsetItem.initialTransform);
    adjustClientRect(offsetItem.clientRect, siblingOffsetY, siblingOffsetX);
  }

  _sortItem(item: DragRef, pointerX: number, pointerY: number,
            pointerDelta: { x: number, y: number }): void {

    const siblings = this._itemPositions;
    const newIndex = this._getItemIndexFromPointerPosition(item, pointerX, pointerY, pointerDelta);

    if (newIndex === -1 && siblings.length > 0) {
      return;
    }

    const isHorizontal = this._orientation === 'horizontal';
    const currentIndex = findIndex(siblings, currentItem => currentItem.drag === item);

    const siblingAtNewPosition = siblings[newIndex];
    const currentPosition      = siblings[currentIndex].clientRect;
    const newPosition          = siblingAtNewPosition.clientRect;
    const delta                = currentIndex > newIndex ? 1 : -1;

    const currentMainAxisLine = siblings[currentIndex].mainAxisLine;
    const newMainAxisLine     = siblings[newIndex].mainAxisLine;


    const gap = this._getSiblingGapPx(currentIndex, siblings) ||
      this._getSiblingGapPx(newIndex, siblings);

    if (currentMainAxisLine != newMainAxisLine) {
      let mainSiblingOffsetX    = 0;
      let newMainSiblingOffsetX = 0;
      let mainSiblingOffsetY    = 0;
      let newMainSiblingOffsetY = 0;
      if (isHorizontal) {
        mainSiblingOffsetX    = -currentPosition.width + -gap;
        newMainSiblingOffsetX = currentPosition.width + gap;
      } else {
        mainSiblingOffsetY    = -currentPosition.height + -gap;
        newMainSiblingOffsetY = currentPosition.height + gap;
      }

      // change the main axis line
      siblings[currentIndex].mainAxisLine = newMainAxisLine;

      // How many pixels the item's placeholder should be offset.
      const [offsetX, offsetY] = this._getItemOffsetPx(currentPosition, newPosition, 1);

      for (let i = 0; i < siblings.length; i++) {
        const offsetItem    = siblings[i];
        const isDraggedItem = siblings[i].drag === item;

        if (isDraggedItem) {
          this._translateItem(offsetItem, true, offsetX, offsetY);
        } else {
          if (siblings[i].mainAxisLine == currentMainAxisLine &&
            currentIndex < i) {
            this._translateItem(offsetItem, false, mainSiblingOffsetX, mainSiblingOffsetY);
          }
          if (siblings[i].mainAxisLine == newMainAxisLine &&
            newIndex <= i
          ) {
            this._translateItem(offsetItem, false, newMainSiblingOffsetX, newMainSiblingOffsetY);
          }
        }
      }

      // Shuffle the array in place. if to < from newIndex can be 0, but it's ok
      moveItemInArray(siblings, currentIndex,
        currentIndex < newIndex ? newIndex - 1 : newIndex);
    } else {
      // How many pixels the item's placeholder should be offset.
      let [itemOffset, itemOffsetY] = this._getItemOffsetPx(currentPosition, newPosition, delta);
      itemOffset                    = isHorizontal ? itemOffset : itemOffsetY;

      // How many pixels all the other items should be offset.
      const siblingOffset = this._getSiblingOffsetPx(currentIndex, siblings, delta);

      // Save the previous order of the items before moving the item to its new index.
      // We use this to check whether an item has been moved as a result of the sorting.
      const oldOrder = siblings.slice();

      // Shuffle the array in place.
      moveItemInArray(siblings, currentIndex, newIndex);

      siblings.forEach((sibling, index) => {
        // Don't do anything if the position hasn't changed.
        if (oldOrder[index] === sibling) {
          return;
        }

        const isDraggedItem = sibling.drag === item;
        const offset        = isDraggedItem ? itemOffset : siblingOffset;

        if (isHorizontal) {
          this._translateItem(sibling, isDraggedItem, offset, 0);
        } else {
          this._translateItem(sibling, isDraggedItem, 0, offset);
        }

      });
    }

    this.sorted.next({
      previousIndex: currentIndex,
      currentIndex : newIndex,
      container    : this.dropContainerRef,
      item
    });


    // Note that it's important that we do this after the client rects have been adjusted.
    this._previousSwap.overlaps = isInsideClientRect(newPosition, pointerX, pointerY);
    this._previousSwap.drag     = siblingAtNewPosition.drag;
    this._previousSwap.delta    = isHorizontal ? pointerDelta.x : pointerDelta.y;
  }

  /**
   * Gets the offset in pixels by which the item that is being dragged should be moved.
   * @param currentPosition Current position of the item.
   * @param newPosition Position of the item where the current item should be moved.
   * @param delta Direction in which the user is moving.
   */
  private _getItemOffsetPx(currentPosition: ClientRect, newPosition: ClientRect, delta: 1 | -1) {
    const isHorizontal = this._orientation === 'horizontal';
    let itemOffsetX    = newPosition.left - currentPosition.left;
    let itemOffsetY    = newPosition.top - currentPosition.top;

    // Account for differences in the item width/height.
    if (delta === -1) {
      itemOffsetX += newPosition.width - currentPosition.width;
      itemOffsetY += newPosition.height - currentPosition.height;
      // itemOffsetY += isHorizontal ? newPosition.height - currentPosition.height :
      //   newPosition.width - currentPosition.width;
    }

    return [itemOffsetX, itemOffsetY];
  }

  private _getSiblingGapPx(itemIndex: number, siblings: CachedItemPosition[],
  ) {
    const isHorizontal    = this._orientation === 'horizontal';
    const currentItem     = siblings[itemIndex];
    const currentPosition = currentItem.clientRect;

    if (siblings[itemIndex + 1] && currentItem.mainAxisLine == siblings[itemIndex + 1].mainAxisLine) {
      const start = isHorizontal ? 'left' : 'top';
      const end   = isHorizontal ? 'right' : 'bottom';
      return (siblings[itemIndex + 1].clientRect[start] - currentPosition[end]);
    } else if (siblings[itemIndex - 1] && currentItem.mainAxisLine == siblings[itemIndex - 1].mainAxisLine) {
      const start = isHorizontal ? 'left' : 'top';
      const end   = isHorizontal ? 'right' : 'bottom';
      return (currentPosition[start] - siblings[itemIndex - 1].clientRect[end]);
    }

    return 0;
  }

  /**
   * Gets the offset in pixels by which the items that aren't being dragged should be moved.
   * @param currentIndex Index of the item currently being dragged.
   * @param siblings All of the items in the list.
   * @param delta Direction in which the user is moving.
   */
  private _getSiblingOffsetPx(currentIndex: number,
                              siblings: CachedItemPosition[],
                              delta: 1 | -1) {

    const isHorizontal     = this._orientation === 'horizontal';
    const currentItem      = siblings[currentIndex];
    const currentPosition  = currentItem.clientRect;
    const immediateSibling = siblings[currentIndex + delta * -1];
    let siblingOffset      = currentPosition[isHorizontal ? 'width' : 'height'] * delta;

    if (immediateSibling) {
      const start = isHorizontal ? 'left' : 'top';
      const end   = isHorizontal ? 'right' : 'bottom';

      // Get the spacing between the start of the current item and the end of the one immediately
      // after it in the direction in which the user is dragging, or vice versa. We add it to the
      // offset in order to push the element to where it will be when it's inline and is influenced
      // by the `margin` of its siblings.
      if (delta === -1) {
        siblingOffset -= immediateSibling.clientRect[start] - currentPosition[end];
      } else {
        siblingOffset += currentPosition[start] - immediateSibling.clientRect[end];
      }
    }

    return siblingOffset;
  }

  _getCurrentSameAxisStartEnd(pointerX: number, pointerY: number) {
    if (this._itemPositions.length === 0) {
      return [-1, -1];
    }
    const isHorizontal = this._orientation === 'horizontal';

    // get current same axis all items
    let startIdx = 0, endIdx = this._itemPositions.length;
    const first  = this._itemPositions[0].clientRect;
    const last   = this._itemPositions[this._itemPositions.length - 1].clientRect;

    const minAxisStart = isHorizontal ? first.top : first.left;
    const maxAxisEnd   = isHorizontal ? last.top : last.left;
    let pointer        = isHorizontal ? pointerY : pointerX;
    pointer            = Math.max(Math.min(maxAxisEnd, pointer), minAxisStart);
    let lastPointer    = -Infinity;
    for (let i = 0; i < this._itemPositions.length; i++) {
      // pointerX
      const {left, top}  = this._itemPositions[i].clientRect;
      const itemPosition = isHorizontal ? top : left;
      if (Math.floor(pointer) < Math.floor(itemPosition)) {
        endIdx = i;
        break;
      }
      if (Math.floor(itemPosition) > Math.floor(lastPointer)) {
        lastPointer = itemPosition;
        startIdx    = i;
      }
    }

    return [startIdx, endIdx];
  }

  /**
   * Gets the index of an item in the drop container, based on the position of the user's pointer.
   * @param item Item that is being sorted.
   * @param pointerX Position of the user's pointer along the X axis.
   * @param pointerY Position of the user's pointer along the Y axis.
   * @param delta Direction in which the user is moving their pointer.
   */
  _getItemIndexFromPointerPosition(item: DragRef, pointerX: number, pointerY: number,
                                   delta?: { x: number, y: number }): number {
    const isHorizontal = this._orientation === 'horizontal';

    const [startIdx, endIdx] = this._getCurrentSameAxisStartEnd(pointerX, pointerY);


    const index = findIndex(this._itemPositions, ({drag, clientRect}, _, array) => {
      if (drag === item) {
        // If there's only one item left in the container, it must be
        // the dragged item itself so we use it as a reference.
        return array.length < 2;
      }

      if (_ < startIdx || _ >= endIdx) {
        return false;
      }

      if (delta) {
        const direction = isHorizontal ? delta.x : delta.y;

        // If the user is still hovering over the same item as last time, their cursor hasn't left
        // the item after we made the swap, and they didn't change the direction in which they're
        // dragging, we don't consider it a direction swap.
        if (drag === this._previousSwap.drag && this._previousSwap.overlaps &&
          direction === this._previousSwap.delta) {
          return false;
        }
      }

      if (this._orientation === 'horizontal') {
        if (_ === startIdx && pointerX < Math.floor(clientRect.left)) {
          return true;
        } else if (_ === endIdx - 1 && pointerX > Math.floor(clientRect.right)) {
          return true;
        }
      } else {
        if (_ === startIdx && pointerY < Math.floor(clientRect.top)) {
          return true;
        } else if (_ === endIdx - 1 && pointerY > Math.floor(clientRect.bottom)) {
          return true;
        }
      }

      // Round these down since most browsers report client rects with
      // sub-pixel precision, whereas the pointer coordinates are rounded to pixels.
      return this._orientation === 'horizontal' ?
        pointerX >= Math.floor(clientRect.left) && pointerX < Math.floor(clientRect.right) :
        pointerY >= Math.floor(clientRect.top) && pointerY < Math.floor(clientRect.bottom);
    });

    return (index === -1 || !this.sortPredicate(index, item, this.dropContainerRef)) ? -1 : index;
  }

  _findItemIndex(item: DragRef) {
    // Items are sorted always by top/left in the cache, however they flow differently in RTL.
    // The rest of the logic still stands no matter what orientation we're in, however
    // we need to invert the array when determining the index.
    const items = this._orientation === 'horizontal' && this._direction === 'rtl' ?
      this._itemPositions.slice().reverse() : this._itemPositions;

    return findIndex(items, currentItem => currentItem.drag === item);
  }

  trackActivePositions(activeDraggables) {
    // _cacheItemPositions
  }

  _cacheItemPositions() {
    const isHorizontal = this._orientation === 'horizontal';

    this._itemPositions = this._activeDraggables.map(drag => {
      const elementToMeasure = drag.getVisibleElement();
      return {
        drag,
        offsetX         : 0,
        offsetY         : 0,
        mainAxisLine    : 0,
        crossAxisLine   : 0,
        initialTransform: elementToMeasure.style.transform || '',
        clientRect      : getMutableClientRect(elementToMeasure),
      };
    }).sort((a, b) => {
      if (isHorizontal) {
        if (Math.floor(a.clientRect.top) == Math.floor(b.clientRect.top)) {
          return a.clientRect.left - b.clientRect.left;
        } else {
          return a.clientRect.top - b.clientRect.top;
        }
      } else {
        if (Math.floor(a.clientRect.left) == Math.floor(b.clientRect.left)) {
          return a.clientRect.top - b.clientRect.top;
        } else {
          return a.clientRect.left - b.clientRect.left;
        }
      }
    });

    if (this._itemPositions.length > 0) {
      this._itemPositions.reduce((prev: CachedItemPosition, curr: CachedItemPosition,
                                  idx: number,
                                  arr: CachedItemPosition[]) => {
        const previousClientRect = prev.clientRect;
        const currentClientRect  = curr.clientRect;

        const isSameAxis = isHorizontal ? (
          Math.floor(currentClientRect.top) == Math.floor(previousClientRect.top) ||
          Math.floor(currentClientRect.bottom) == Math.floor(previousClientRect.bottom)
        ) : (
          Math.floor(currentClientRect.left) == Math.floor(previousClientRect.left) ||
          Math.floor(currentClientRect.right) == Math.floor(previousClientRect.right)
        );
        if (isSameAxis) {
          curr.mainAxisLine = prev.mainAxisLine;
        } else {
          curr.mainAxisLine = prev.mainAxisLine + 1;
        }
        return curr;
      });
    }
  }

  /**
   * Function that is used to determine whether an item
   * is allowed to be moved into a drop container.
   */
  get enterPredicate(): (drag: DragRef, drop: DndContainerRef) => boolean {
    return this.dropContainerRef.enterPredicate;
  }

  /** Functions that is used to determine whether an item can be sorted into a particular index. */
  get sortPredicate(): (index: number, drag: DragRef, drop: DndContainerRef) => boolean {
    return this.dropContainerRef.sortPredicate;
  }

  reset() {
    this._itemPositions = [];

    this._previousSwap.drag     = null;
    this._previousSwap.delta    = 0;
    this._previousSwap.overlaps = false;
  }

  dispose() {

  }

}