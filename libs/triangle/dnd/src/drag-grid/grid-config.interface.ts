/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { GridComponentInterface } from './grid.interface';
import {
  GridItem,
  GridItemComponentInterface
} from './grid-item.interface';

export type gridTypes =
  | 'fit'
  | 'scrollVertical'
  | 'scrollHorizontal'
  | 'fixed'
  | 'verticalFixed'
  | 'horizontalFixed';
export type displayGrids = 'always' | 'onDrag&Resize' | 'none';
export type compactTypes =
  | 'none'
  | 'compactUp'
  | 'compactLeft'
  | 'compactUp&Left'
  | 'compactLeft&Up'
  | 'compactRight'
  | 'compactUp&Right'
  | 'compactRight&Up'
  | 'compactDown'
  | 'compactDown&Left'
  | 'compactLeft&Down'
  | 'compactDown&Right'
  | 'compactRight&Down';

export const enum GridType {
  Fit              = 'fit',
  ScrollVertical   = 'scrollVertical',
  ScrollHorizontal = 'scrollHorizontal',
  Fixed            = 'fixed',
  VerticalFixed    = 'verticalFixed',
  HorizontalFixed  = 'horizontalFixed'
}

export const enum DisplayGrid {
  Always          = 'always',
  OnDragAndResize = 'onDrag&Resize',
  None            = 'none'
}

export const enum CompactType {
  None                = 'none',
  CompactUp           = 'compactUp',
  CompactLeft         = 'compactLeft',
  CompactUpAndLeft    = 'compactUp&Left',
  CompactLeftAndUp    = 'compactLeft&Up',
  CompactRight        = 'compactRight',
  CompactUpAndRight   = 'compactUp&Right',
  CompactRightAndUp   = 'compactRight&Up',
  CompactDown         = 'compactDown',
  CompactDownAndLeft  = 'compactDown&Left',
  CompactLeftAndDown  = 'compactLeft&Down',
  CompactDownAndRight = 'compactDown&Right',
  CompactRightAndDown = 'compactRight&Down'
}

export const enum DirTypes {
  LTR = 'ltr',
  RTL = 'rtl'
}

export type dirTypes = 'ltr' | 'rtl';

export interface GridsterConfig {
  gridType?: gridTypes;
  scale?: number;
  fixedColWidth?: number;
  fixedRowHeight?: number;
  keepFixedHeightInMobile?: boolean;
  keepFixedWidthInMobile?: boolean;
  setGridSize?: boolean;
  compactType?: compactTypes;
  mobileBreakpoint?: number;
  allowMultiLayer?: boolean;
  defaultLayerIndex?: number;
  maxLayerIndex?: number;
  baseLayerIndex?: number;
  minCols?: number;
  maxCols?: number;
  minRows?: number;
  maxRows?: number;
  defaultItemCols?: number;
  defaultItemRows?: number;
  maxItemCols?: number;
  maxItemRows?: number;
  minItemCols?: number;
  minItemRows?: number;
  minItemArea?: number;
  maxItemArea?: number;
  addEmptyRowsCount?: number;
  rowHeightRatio?: number;
  margin?: number;
  outerMargin?: boolean;
  outerMarginTop?: number | null;
  outerMarginRight?: number | null;
  outerMarginBottom?: number | null;
  outerMarginLeft?: number | null;
  useTransformPositioning?: boolean;
  scrollSensitivity?: number | null;
  scrollSpeed?: number;
  initCallback?: (grid: GridComponentInterface) => void;
  destroyCallback?: (grid: GridComponentInterface) => void;
  gridSizeChangedCallback?: (grid: GridComponentInterface) => void;
  itemChangeCallback?: (
    item: GridItem,
    itemComponent: GridItemComponentInterface
  ) => void;
  itemResizeCallback?: (
    item: GridItem,
    itemComponent: GridItemComponentInterface
  ) => void;
  itemInitCallback?: (
    item: GridItem,
    itemComponent: GridItemComponentInterface
  ) => void;
  itemRemovedCallback?: (
    item: GridItem,
    itemComponent: GridItemComponentInterface
  ) => void;
  itemValidateCallback?: (item: GridItem) => boolean;
  draggable?: Draggable;
  resizable?: Resizable;
  swap?: boolean;
  swapWhileDragging?: boolean;
  pushItems?: boolean;
  disablePushOnDrag?: boolean;
  disablePushOnResize?: boolean;
  disableAutoPositionOnConflict?: boolean;
  pushDirections?: PushDirections;
  pushResizeItems?: boolean;
  displayGrid?: displayGrids;
  disableWindowResize?: boolean;
  disableWarnings?: boolean;
  scrollToNewItems?: boolean;
  disableScrollHorizontal?: boolean;
  disableScrollVertical?: boolean;
  enableEmptyCellClick?: boolean;
  enableEmptyCellContextMenu?: boolean;
  enableEmptyCellDrop?: boolean;
  enableEmptyCellDrag?: boolean;
  enableOccupiedCellDrop?: boolean;
  emptyCellClickCallback?: (event: MouseEvent, item: GridItem) => void;
  emptyCellContextMenuCallback?: (
    event: MouseEvent,
    item: GridItem
  ) => void;
  emptyCellDropCallback?: (event: DragEvent, item: GridItem) => void;
  emptyCellDragCallback?: (event: MouseEvent, item: GridItem) => void;
  emptyCellDragMaxCols?: number;
  emptyCellDragMaxRows?: number;
  ignoreMarginInRow?: boolean;
  dirType?: dirTypes;
  api?: {
    resize?: () => void;
    optionsChanged?: () => void;
    getNextPossiblePosition?: (newItem: GridItem) => boolean;
    getFirstPossiblePosition?: (item: GridItem) => GridItem;
    getLastPossiblePosition?: (item: GridItem) => GridItem;
    getItemComponent?: (
      item: GridItem
    ) => GridItemComponentInterface | undefined;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
}

export interface DragBase {
  enabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stop?: (
    item: GridItem,
    itemComponent: GridItemComponentInterface,
    event: MouseEvent
  ) => Promise<any> | void;
  start?: (
    item: GridItem,
    itemComponent: GridItemComponentInterface,
    event: MouseEvent
  ) => void;
  delayStart?: number;
}

export interface Draggable extends DragBase {
  ignoreContentClass?: string;
  ignoreContent?: boolean;
  dragHandleClass?: string;
  dropOverItems?: boolean;
  dropOverItemsCallback?: (
    source: GridItem,
    target: GridItem,
    grid?: GridComponentInterface
  ) => void;
}

export interface Resizable extends DragBase {
  handles?: {
    s: boolean;
    e: boolean;
    n: boolean;
    w: boolean;
    se: boolean;
    ne: boolean;
    sw: boolean;
    nw: boolean;
  };
}

export interface PushDirections {
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
}
