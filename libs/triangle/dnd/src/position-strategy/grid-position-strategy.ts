/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CachedItemPosition } from '../drop-container.interface';
import { DndContainerRef, } from '../drag-drop-ref/dnd-container-ref';
import { DragRefInternal as DragRef } from '../drag-drop-ref/drag-ref';
import { DropGridContainerRef } from '../drag-drop-ref/drop-grid-container-ref';
import { DragDropRegistry } from '../drag-drop-registry';
import { PositionStrategy } from './position-strategy';

export class GridPositionStrategy implements PositionStrategy {

  _itemPositions: CachedItemPosition[] = [];

  public dropContainerRef: DropGridContainerRef;

  constructor(public _dragDropRegistry: DragDropRegistry<DragRef, DndContainerRef>) {
  }

  _sortItem(item: DragRef, pointerX: number, pointerY: number,
            pointerDelta: { x: number; y: number; }): void {
    throw new Error('Method not implemented.');
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
