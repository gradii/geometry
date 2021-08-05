/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { coerceElement } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ElementRef, NgZone } from '@angular/core';
import { TriDropGridContainer } from '@gradii/triangle/dnd';
import { combineTransforms, DragCSSStyleDeclaration } from '@gradii/triangle/dnd/src/drag-styling';
import { adjustClientRect } from '@gradii/triangle/dnd/src/utils/client-rect';
import { GridPushService } from '../drag-grid/grid-push.service';
import { GridSwapService } from '../drag-grid/grid-swap.service';
import { GridPositionStrategy } from '../position-strategy/grid-position-strategy';
import { CompactType } from '../enum';
import { Subject } from 'rxjs';
import { DragDropRegistry } from '../drag-drop-registry';
import { DragRefInternal as DragRef } from './drag-ref';
import { DndContainerRef } from './dnd-container-ref';

/**
 * Reference to a drop list. Used to manipulate or dispose of the container.
 */
export class DropGridContainerRef<T = any> extends DndContainerRef<T> {
  hasPadding: boolean;
  gutter: number = 0;
  currentWidth: number;
  currentHeight: number;
  currentColumnWidth: number;
  currentRowHeight: number;
  // viewPort: {
  //   x: number,
  //   y: number,
  //   width: number,
  //   height: number
  // };
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
    protected positionStrategy: GridPositionStrategy
  ) {
    super(element,
      _dragDropRegistry,
      _document,
      _ngZone,
      _viewportRuler,
      positionStrategy);

    const pushService = new GridPushService();
    const swapService = new GridSwapService();
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

    // const {x: positionX, y: positionY} = this.positionStrategy.pixelsToPosition(item, pointerX, pointerY);
    // console.log(positionX, positionY);

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

    coerceElement(this.element).appendChild(placeholder);

    // The transform needs to be cleared so it doesn't throw off the measurements.
    placeholder.style.transform = '';

    placeholder.style.width  = `${((this.data as unknown as TriDropGridContainer).config?.defaultItemCols || 1) * this.currentColumnWidth - this.gutter}px`;
    placeholder.style.height = `${((this.data as unknown as TriDropGridContainer).config?.defaultItemRows || 1) * this.currentRowHeight - this.gutter}px`;

    // Note that the positions were already cached when we called `start` above,
    // but we need to refresh them since the amount of items has changed and also parent rects.
    this._cacheItemPositions();
    this._cacheParentPositions();

    // Notify siblings at the end so that the item has been inserted into the `activeDraggables`.
    this._notifyReceivingSiblings();
    this.entered.next({item, container: this, currentIndex: this.getItemIndex(item)});
  }

  lastDragCols = 1;
  lastDragRows = 1;

  _arrangeItem(item: DragRef, pointerX: number, pointerY: number,
               elementPointX: number, elementPointY: number,
               pointerDelta: { x: number; y: number }) {
    super._arrangeItem(item, pointerX, pointerY, elementPointX, elementPointY, pointerDelta);

    const positionX = this.positionStrategy.pixelsToPositionX(item, elementPointX);
    const positionY = this.positionStrategy.pixelsToPositionY(item, elementPointY);
    console.log(positionX, positionY);

    const placeholderRef = item.getPlaceholderElement();

    const maxColumns  = Math.max(positionX + 1, (this.data as unknown as TriDropGridContainer).cols, this.lastDragCols);
    const maxRows     = Math.max(positionY + 1, (this.data as unknown as TriDropGridContainer).rows, this.lastDragRows);
    this.lastDragCols = maxColumns;
    this.lastDragRows = maxRows;

    let contentWidth, contentHeight;
    if (!this.hasPadding) {
      contentWidth  = maxColumns * this.currentColumnWidth - this.gutter;
      contentHeight = maxRows * this.currentRowHeight - this.gutter;
    } else {
      contentWidth  = maxColumns * this.currentColumnWidth + this.gutter;
      contentHeight = maxRows * this.currentRowHeight + this.gutter;
    }

    (this.data as unknown as TriDropGridContainer).contentElement.nativeElement.style.width  = `${contentWidth}px`;
    (this.data as unknown as TriDropGridContainer).contentElement.nativeElement.style.height = `${contentHeight}px`;

    let x, y;
    if (!this.hasPadding) {
      x = positionX * this.currentColumnWidth;
      y = positionY * this.currentRowHeight;
    } else {
      x = positionX * this.currentColumnWidth + this.gutter;
      y = positionY * this.currentRowHeight + this.gutter;
    }

    // this.width  = this.cols * currentColumnWidth - container.gutter;
    // this.height = this.rows * currentColumnHeight - container.gutter;


    placeholderRef.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  checkCollision() {

  }

  _reset() {
    (this.data as unknown as TriDropGridContainer).contentElement.nativeElement.style.width  = `0`;
    (this.data as unknown as TriDropGridContainer).contentElement.nativeElement.style.height = `0`;


    // #####################

    this._isDragging = false;

    this._siblings.forEach(sibling => sibling._stopReceiving(this));

    this.positionStrategy.reset();

    this._activeDraggables = [];

    this._stopScrolling();
    this._viewportScrollSubscription.unsubscribe();
    this.scrollingStrategy.reset();
  }

  getItemPosition(item: DragRef): string {
    return 'absolute';
  }
}
