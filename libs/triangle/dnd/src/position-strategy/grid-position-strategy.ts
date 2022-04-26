/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TriDropGridContainer } from '../directives/drop-grid-container';
import { TriDragGridItemComponent } from '../drag-grid/drag-grid-item.component';
import { CachedItemPosition } from '../drop-container.interface';
import { DndContainerRef, } from '../drag-drop-ref/dnd-container-ref';
import { DragRefInternal as DragRef } from '../drag-drop-ref/drag-ref';
import { DropGridContainerRef } from '../drag-drop-ref/drop-grid-container-ref';
import { DragDropRegistry } from '../drag-drop-registry';
import { PositionStrategy } from './position-strategy';

export class GridPositionStrategy implements PositionStrategy {

  _itemPositions: CachedItemPosition[] = [];

  public dropContainerRef: DropGridContainerRef;

  constructor(
    public _dragDropRegistry: DragDropRegistry<DragRef, DndContainerRef>
  ) {
  }

  latestPositionX: number = 0;
  latestPositionY: number = 0;

  _sortItem(item: DragRef, elementPointX: number, elementPointY: number,
            pointerDelta: { x: number; y: number; }): void {
    const positionX = this.pixelsToPositionX(item, elementPointX);
    const positionY = this.pixelsToPositionY(item, elementPointY);

    const placeholderRef = item.getPlaceholderElement();

    const maxColumns                   = Math.max(
      positionX + 1,
      (this.dropContainerRef.data as unknown as TriDropGridContainer).renderCols,
      this.dropContainerRef.lastDragCols);
    const maxRows                      = Math.max(
      positionY + 1,
      (this.dropContainerRef.data as unknown as TriDropGridContainer).renderRows,
      this.dropContainerRef.lastDragRows);
    this.dropContainerRef.lastDragCols = maxColumns;
    this.dropContainerRef.lastDragRows = maxRows;

    let contentWidth, contentHeight;
    if (!this.dropContainerRef.hasPadding) {
      contentWidth  = maxColumns * this.dropContainerRef.currentColumnWidth - this.dropContainerRef.gutter;
      contentHeight = maxRows * this.dropContainerRef.currentRowHeight - this.dropContainerRef.gutter;
    } else { // todo implement padding
      contentWidth  = maxColumns * this.dropContainerRef.currentColumnWidth + this.dropContainerRef.gutter;
      contentHeight = maxRows * this.dropContainerRef.currentRowHeight + this.dropContainerRef.gutter;
    }

    (this.dropContainerRef.data as unknown as TriDropGridContainer).contentElement.nativeElement.style.width  = `${contentWidth}px`;
    (this.dropContainerRef.data as unknown as TriDropGridContainer).contentElement.nativeElement.style.height = `${contentHeight}px`;

    let x, y;
    if (!this.dropContainerRef.hasPadding) {
      x = positionX * this.dropContainerRef.currentColumnWidth;
      y = positionY * this.dropContainerRef.currentRowHeight;
    } else {
      x = positionX * this.dropContainerRef.currentColumnWidth + this.dropContainerRef.gutter;
      y = positionY * this.dropContainerRef.currentRowHeight + this.dropContainerRef.gutter;
    }

    // this.width  = this.cols * currentColumnWidth - container.gutter;
    // this.height = this.rows * currentColumnHeight - container.gutter;


    this.latestPositionX = positionX;
    this.latestPositionY = positionY;

    (item.data as unknown as TriDragGridItemComponent).renderX = positionX;
    (item.data as unknown as TriDragGridItemComponent).renderY = positionY;

    placeholderRef.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    // this.pushService._pushItem(item, (this.data as unknown as TriDropGridContainer), positionX, positionY,
    //   pointerDelta);
  }

  _getItemIndexFromPointerPosition(item: DragRef, pointerX: number, pointerY: number): number {
    return -1;
  }

  pixelsToPositionX(item: DragRef, pointerX: number) {
    const ref        = this.dropContainerRef;
    const left       = ref._clientRect.left;
    const scrollLeft = (ref.element as HTMLElement).scrollLeft;
    if (ref.hasPadding) {
      return Math.round((pointerX - left + scrollLeft - ref.gutter / 2) / ref.currentColumnWidth);
    } else {
      return Math.round((pointerX - left + scrollLeft + ref.gutter / 2) / ref.currentColumnWidth);
    }
  }

  pixelsToPositionY(item: DragRef, pointerY: number) {
    const ref       = this.dropContainerRef;
    const top       = ref._clientRect.top;
    const scrollTop = (ref.element as HTMLElement).scrollTop;
    if (ref.hasPadding) {
      return Math.round((pointerY - top + scrollTop - ref.gutter / 2) / ref.currentRowHeight);
    } else {
      return Math.round((pointerY - top + scrollTop + ref.gutter / 2) / ref.currentRowHeight);
    }
  }

  _cacheItemPositions(): void {

  }

  _findItemIndex(item: DragRef): number {
    return -1;
  }

  adjustItemPositions(cb: (clientRect: ClientRect) => void): void {
  }

  repositionDraggingItem(): void {
  }

  dispose(): void {
  }

  reset(): void {
  }
}
