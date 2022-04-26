/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { GridConfigS } from './grid-config-s.interface';
import { ChangeDetectorRef, NgZone, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
// import { GridsterEmptyCell } from './gridsterEmptyCell.service';
import { GridCompactService } from './grid-compact.service';
import { GridsterConfig } from './grid-config.interface';
import {
  GridItem,
  GridItemComponentInterface
} from './grid-item.interface';

// import { GridsterRenderer } from './gridsterRenderer.service';

/**
 * @deprecated
 */
export abstract class GridComponentInterface {
  $options: GridConfigS;
  grid: GridItemComponentInterface[];
  checkCollision: (
    item: GridItem
  ) => GridItemComponentInterface | boolean;
  checkCollisionForSwaping: (
    item: GridItem
  ) => GridItemComponentInterface | boolean;
  positionXToPixels: (x: number) => number;
  pixelsToPositionX: (
    x: number,
    roundingMethod: (x: number) => number,
    noLimit?: boolean
  ) => number;
  positionYToPixels: (y: number) => number;
  pixelsToPositionY: (
    y: number,
    roundingMethod: (x: number) => number,
    noLimit?: boolean
  ) => number;
  findItemWithItem: (
    item: GridItem
  ) => GridItemComponentInterface | boolean;
  findItemsWithItem: (item: GridItem) => GridItemComponentInterface[];
  checkGridCollision: (item: GridItem) => boolean;
  checkCollisionTwoItems: (item: GridItem, item2: GridItem) => boolean;
  getItemComponent: (
    item: GridItem
  ) => GridItemComponentInterface | undefined;
  el: HTMLElement;
  renderer: Renderer2;
  // gridRenderer: GridsterRenderer;
  cdRef: ChangeDetectorRef;
  options: GridsterConfig;
  calculateLayout$: Subject<void>;
  updateGrid: () => void;
  movingItem: GridItem | null;
  addItem: (item: GridItemComponentInterface) => void;
  removeItem: (item: GridItemComponentInterface) => void;
  previewStyle: (drag?: boolean) => void;
  mobile: boolean;
  curWidth: number;
  curHeight: number;
  columns: number;
  rows: number;
  curColWidth: number;
  curRowHeight: number;
  windowResize: (() => void) | null;
  setGridDimensions: () => void;
  dragInProgress: boolean;
  // emptyCell: GridsterEmptyCell;
  compact: GridCompactService;
  zone: NgZone;
  gridRows: Array<number>;
  gridColumns: Array<number>;
}
