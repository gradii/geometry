/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ViewportRuler } from '@angular/cdk/scrolling';
import { ElementRef, NgZone } from '@angular/core';
import { CompactType } from '../enum';
import { Subject } from 'rxjs';
import { DragDropRegistry } from '../drag-drop-registry';
import { DragRefInternal as DragRef } from './drag-ref';
import { DndContainerRef } from './dnd-container-ref';
import { SortPositionStrategy } from '../position-strategy/sort-position-strategy';

/**
 * Reference to a drop list. Used to manipulate or dispose of the container.
 */
export class DropGridContainerRef<T = any> extends DndContainerRef<T> {
  currentWidth: number;
  currentHeight: number;
  currentColumnWidth: number;
  currentRowHeight: number;
  gridColumns: number[] = [];
  gridRows: number[]    = [];

  compactType: CompactType;

  /** Emits as the user is swapping items while actively dragging. */
  readonly arranged = new Subject<{
    previousIndex: number,
    currentIndex: number,
    previousPosition: [number, number],
    currentPosition: [number, number],
    container: DndContainerRef,
    item: DragRef
  }>();

  constructor(
    element: ElementRef<HTMLElement> | HTMLElement,
    protected _dragDropRegistry: DragDropRegistry<DragRef, DndContainerRef>,
    _document: any,
    protected _ngZone: NgZone,
    protected _viewportRuler: ViewportRuler,
    protected positionStrategy: SortPositionStrategy
  ) {
    super(element,
      _dragDropRegistry,
      _document,
      _ngZone,
      _viewportRuler,
      positionStrategy);
  }

  enter(item: DragRef, pointerX: number, pointerY: number): void {
    this._draggingStarted();
    //
    // // If sorting is disabled, we want the item to return to its starting
    // // position if the user is returning it to its initial container.
    // let newIndex: number;
    //
    // if (index == null) {
    //   newIndex = this.sortingDisabled ? this._draggables.indexOf(item) : -1;
    //
    //   if (newIndex === -1) {
    //     // We use the coordinates of where the item entered the drop
    //     // zone to figure out at which index it should be inserted.
    //     newIndex = this.positionStrategy._getItemIndexFromPointerPosition(item, pointerX, pointerY);
    //   }
    // } else {
    //   newIndex = index;
    // }
    //
    // const activeDraggables                        = this._activeDraggables;
    // const currentIndex                            = activeDraggables.indexOf(item);
    const placeholder = item.getPlaceholderElement();

    const previewRef = item.getPreviewRef();
    // let newPositionReference: DragRef | undefined = activeDraggables[newIndex];
    //
    // // If the item at the new position is the same as the item that is being dragged,
    // // it means that we're trying to restore the item to its initial position. In this
    // // case we should use the next item from the list as the reference.
    // if (newPositionReference === item) {
    //   newPositionReference = activeDraggables[newIndex + 1];
    // }
    //
    // // Since the item may be in the `activeDraggables` already (e.g. if the user dragged it
    // // into another container and back again), we have to ensure that it isn't duplicated.
    // if (currentIndex > -1) {
    //   activeDraggables.splice(currentIndex, 1);
    // }
    //
    // // Don't use items that are being dragged as a reference, because
    // // their element has been moved down to the bottom of the body.
    // if (newPositionReference && !this._dragDropRegistry.isDragging(newPositionReference)) {
    //   const element = newPositionReference.getRootElement();
    //   element.parentElement!.insertBefore(placeholder, element);
    //   activeDraggables.splice(newIndex, 0, item);
    // } else if (this._shouldEnterAsFirstChild(pointerX, pointerY)) {
    //   const reference = activeDraggables[0].getRootElement();
    //   reference.parentNode!.insertBefore(placeholder, reference);
    //   activeDraggables.unshift(item);
    // } else {
    //   coerceElement(this.element).appendChild(placeholder);
    //   activeDraggables.push(item);
    // }
    //
    // if (placeholder.parentNode) {
    //   placeholder.parentNode.removeChild(placeholder);
    // }

    // The transform needs to be cleared so it doesn't throw off the measurements.
    placeholder.style.transform = '';

    // Note that the positions were already cached when we called `start` above,
    // but we need to refresh them since the amount of items has changed and also parent rects.
    this._cacheItemPositions();
    this._cacheParentPositions();

    // Notify siblings at the end so that the item has been inserted into the `activeDraggables`.
    this._notifyReceivingSiblings();
    this.entered.next({item, container: this, currentIndex: this.getItemIndex(item)});
  }


  _arrangeItem(item: DragRef, pointerX: number, pointerY: number, pointerDelta: { x: number; y: number }) {
    super._arrangeItem(item, pointerX, pointerY, pointerDelta);
  }

  checkCollision() {

  }

  getItemPosition(item: DragRef): string {
    return 'absolute';
  }
}
