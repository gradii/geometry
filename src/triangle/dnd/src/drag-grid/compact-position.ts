/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { TriDropGridContainer } from '../directives/drop-grid-container';
import { TriDragGridItemComponent } from '../drag-grid/drag-grid-item.component';
import { CompactType } from '../enum';

export interface GridsterItem {
  x: number;
  y: number;
  rows: number;
  cols: number;
  layerIndex?: number;
  initCallback?: (item: GridsterItem, itemComponent: any) => void;
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  compactEnabled?: boolean;
  maxItemRows?: number;
  minItemRows?: number;
  maxItemCols?: number;
  minItemCols?: number;
  minItemArea?: number;
  maxItemArea?: number;

  // tslint:disable-next-line:no-any
  [propName: string]: any;
}


export class CompactPosition {
  compactType: CompactType;

  constructor(private ref: Pick<TriDropGridContainer, 'compactType' | 'getUnSortedItems' | 'checkCollision'>) {
  }

  destroy(): void {
    // @ts-ignore
    delete this.ref;
  }

  checkCompact(compactType: CompactType): void {
    this.compactType = compactType;
    if (compactType !== CompactType.None) {
      if (compactType === CompactType.CompactUp) {
        this.checkCompactMovement('y', -1);
      } else if (compactType === CompactType.CompactLeft) {
        this.checkCompactMovement('x', -1);
      } else if (compactType === CompactType.CompactUpAndLeft) {
        this.checkCompactMovement('y', -1);
        this.checkCompactMovement('x', -1);
      } else if (compactType === CompactType.CompactLeftAndUp) {
        this.checkCompactMovement('x', -1);
        this.checkCompactMovement('y', -1);
      } else if (compactType === CompactType.CompactRight) {
        this.checkCompactMovement('x', 1);
      } else if (compactType === CompactType.CompactUpAndRight) {
        this.checkCompactMovement('y', -1);
        this.checkCompactMovement('x', 1);
      } else if (compactType === CompactType.CompactRightAndUp) {
        this.checkCompactMovement('x', 1);
        this.checkCompactMovement('y', -1);
      } else if (compactType === CompactType.CompactDown) {
        this.checkCompactMovement('y', 1);
      } else if (compactType === CompactType.CompactDownAndLeft) {
        this.checkCompactMovement('y', 1);
        this.checkCompactMovement('x', -1);
      } else if (compactType === CompactType.CompactDownAndRight) {
        this.checkCompactMovement('y', 1);
        this.checkCompactMovement('x', 1);
      } else if (compactType === CompactType.CompactLeftAndDown) {
        this.checkCompactMovement('x', -1);
        this.checkCompactMovement('y', 1);
      } else if (compactType === CompactType.CompactRightAndDown) {
        this.checkCompactMovement('x', 1);
        this.checkCompactMovement('y', 1);
      }
    }
  }

  checkCompactItem(item: TriDragGridItemComponent): void {
    const compactType = this.ref.compactType;

    if (compactType !== CompactType.None) {
      if (compactType === CompactType.CompactUp) {
        this.moveTillCollision(item, 'y', -1);
      } else if (compactType === CompactType.CompactLeft) {
        this.moveTillCollision(item, 'x', -1);
      } else if (compactType === CompactType.CompactUpAndLeft) {
        this.moveTillCollision(item, 'y', -1);
        this.moveTillCollision(item, 'x', -1);
      } else if (compactType === CompactType.CompactLeftAndUp) {
        this.moveTillCollision(item, 'x', -1);
        this.moveTillCollision(item, 'y', -1);
      } else if (compactType === CompactType.CompactUpAndRight) {
        this.moveTillCollision(item, 'y', -1);
        this.moveTillCollision(item, 'x', 1);
      } else if (compactType === CompactType.CompactDown) {
        this.moveTillCollision(item, 'y', 1);
      } else if (compactType === CompactType.CompactDownAndLeft) {
        this.moveTillCollision(item, 'y', 1);
        this.moveTillCollision(item, 'x', -1);
      } else if (compactType === CompactType.CompactLeftAndDown) {
        this.moveTillCollision(item, 'x', -1);
        this.moveTillCollision(item, 'y', 1);
      } else if (compactType === CompactType.CompactDownAndRight) {
        this.moveTillCollision(item, 'y', 1);
        this.moveTillCollision(item, 'x', 1);
      } else if (compactType === CompactType.CompactRightAndDown) {
        this.moveTillCollision(item, 'x', 1);
        this.moveTillCollision(item, 'y', 1);
      }
    }
  }

  private checkCompactMovement(direction: 'x' | 'y', delta: number): void {
    let widgetMoved = false;
    this.ref.getUnSortedItems().forEach((dragItem: TriDragGridItemComponent) => {
      if (dragItem.compactEnabled !== false) {
        const moved = this.moveTillCollision(dragItem, direction, delta);
        if (moved) {
          widgetMoved         = true;
          dragItem[direction] = dragItem[direction];
          // dragRef.itemChanged();
        }
      }
    });
    if (widgetMoved) {
      this.checkCompact(this.compactType);
    }
  }

  private moveTillCollision(item: TriDragGridItemComponent, direction: 'x' | 'y', delta: number): boolean {
    direction === 'x' ? this._moveTileX(item, delta) : this._moveTileY(item, delta);
    if (this.ref.checkCollision(item)) {
      direction === 'x' ? this._moveTileX(item, -delta) : this._moveTileY(item, -delta);
      return false;
    } else {
      this.moveTillCollision(item, direction, delta);
      return true;
    }
    return true;
  }

  private _moveTileX(item: TriDragGridItemComponent, delta: number) {
    item.x += delta;
  }

  private _moveTileY(item: TriDragGridItemComponent, delta: number) {
    item.y += delta;
  }
}
