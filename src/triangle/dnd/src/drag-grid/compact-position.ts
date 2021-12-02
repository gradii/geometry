/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import type { TriDropGridContainer } from '../directives/drop-grid-container';
import type { TriDragGridItemComponent } from '../drag-grid/drag-grid-item.component';
import { CompactType, Direction} from '../enum';

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

  constructor(private ref: Pick<TriDropGridContainer,
    'maxCols' | 'maxRows' |
    'compactType' | 'getUnSortedItems' | 'getSortedItems' | 'checkCollision'>) {
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

  private _compactMovement(
    sorted: TriDragGridItemComponent[],
    delta: number,
    getDimensionValue: (item: TriDragGridItemComponent) => {
      rowPosition: number,
      columnPosition: number,
      rowSize: number,
      columnSize: number,
      minDirectionSize: number,
      maxDirectionSize: number
    },
    setDirectionValue: (item: TriDragGridItemComponent,
                        value: number) => void) {
    let widgetMoved         = false;
    const heightMap: number[] = [];
    const fn                = (prev: number[], item: TriDragGridItemComponent) => {
      const {
              rowPosition, columnPosition,
              rowSize, columnSize,
              minDirectionSize, maxDirectionSize
            } = getDimensionValue(item);

      const start = rowPosition, end = start + rowSize;

      const initHeight = delta == -1 ? minDirectionSize : -maxDirectionSize;
      if (end > heightMap.length) {
        heightMap.fill(initHeight, heightMap.length, heightMap.length = end);
      }
      const currentHeight = Math.max(initHeight, ...heightMap.slice(start, end));
      const itemHeight    = delta == -1 ? currentHeight : -(currentHeight + columnSize);
      if (columnPosition != itemHeight) {
        setDirectionValue(item, itemHeight);
        widgetMoved = true;
      }
      heightMap.fill(currentHeight + columnSize, start, end);
      return heightMap;
    };
    delta == -1 ? sorted.reduce(fn, heightMap) : sorted.reduceRight(fn, heightMap);
    return widgetMoved;
  }

  private checkCompactMovement(direction: 'x' | 'y', delta: number): void {
    let widgetMoved = false;

    if (direction == 'y') {
      const sorted = this.ref.getSortedItems(Direction.xy);
      widgetMoved  = this._compactMovement(
        sorted,
        delta,
        (item) => {
          return {
            rowPosition     : item.x,
            columnPosition  : item.y,
            rowSize         : item.cols,
            columnSize      : item.rows,
            minDirectionSize: 0,
            maxDirectionSize: this.ref.maxRows
          };
        },
        (item, value) => item.y = value
      );
    } else {
      const sorted = this.ref.getSortedItems(Direction.yx);
      widgetMoved  = this._compactMovement(
        sorted,
        delta,
        (item) => {
          return {
            rowPosition     : item.y,
            columnPosition  : item.x,
            rowSize         : item.rows,
            columnSize      : item.cols,
            minDirectionSize: 0,
            maxDirectionSize: this.ref.maxCols
          };
        },
        (item, value) => item.x = value
      );
    }
  }
}
