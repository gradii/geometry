/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { InjectionToken } from '@angular/core';
import { DragRef, DragRefConfig, Point } from '../drag-drop-ref/drag-ref';

/** Possible values that can be used to configure the drag start delay. */
export type DragStartDelay = number | { touch: number, mouse: number };

/** Possible axis along which dragging can be locked. */
export type DragAxis = 'x' | 'y';

/** Function that can be used to constrain the position of a dragged element. */
export type DragConstrainPosition = (point: Point, dragRef: DragRef) => Point;

/** Possible orientations for a drop list. */
export type DropContainerOrientation = 'horizontal' | 'vertical';

/**
 * Injection token that can be used to configure the
 * behavior of the drag&drop-related components.
 */
export const TRI_DRAG_CONFIG = new InjectionToken<DragDropConfig>('TRI_DRAG_CONFIG');

/**
 * Object that can be used to configure the drag
 * items and drop lists within a module or a component.
 */
export interface DragDropConfig extends Partial<DragRefConfig> {
  lockAxis?: DragAxis;
  dragStartDelay?: DragStartDelay;
  constrainPosition?: DragConstrainPosition;
  previewClass?: string | string[];
  boundaryElement?: string;
  rootElementSelector?: string;
  draggingDisabled?: boolean;
  sortingDisabled?: boolean;
  listAutoScrollDisabled?: boolean;
  listOrientation?: DropContainerOrientation;
  zIndex?: number;
  previewContainer?: 'global' | 'parent';
}
