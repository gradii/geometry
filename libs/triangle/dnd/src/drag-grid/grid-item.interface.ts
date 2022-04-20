/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

// import { GridsterDraggable } from './gridsterDraggable.service';
import { Renderer2 } from '@angular/core';
import { GridResizableService } from './grid-resizable.service';
import { GridComponentInterface } from './grid.interface';

export abstract class GridItemComponentInterface {
  item: GridItem;
  $item: GridItem;
  top: number;
  left: number;
  width: number;
  height: number;
  // drag: GridsterDraggable;
  resize: GridResizableService;
  notPlaced: boolean;
  updateOptions: () => void;
  itemChanged: () => void;
  setSize: () => void;
  checkItemChanges: (newValue: GridItem, oldValue: GridItem) => void;
  canBeDragged: () => boolean;
  canBeResized: () => boolean;
  bringToFront: (offset: number) => void;
  sendToBack: (v: number) => void;
  el: HTMLElement;
  gridster: GridComponentInterface;
  renderer: Renderer2;
}

export interface GridItem {
  x: number;
  y: number;
  rows: number;
  cols: number;
  layerIndex?: number;
  initCallback?: (
    item: GridItem,
    itemComponent: GridItemComponentInterface
  ) => void;
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  compactEnabled?: boolean;
  maxItemRows?: number;
  minItemRows?: number;
  maxItemCols?: number;
  minItemCols?: number;
  minItemArea?: number;
  maxItemArea?: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
}
