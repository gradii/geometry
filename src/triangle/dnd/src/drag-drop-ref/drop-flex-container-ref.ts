/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ViewportRuler } from '@angular/cdk/scrolling';
import { ElementRef, NgZone } from '@angular/core';
import { DragDropRegistry } from '../drag-drop-registry';
import { DragRefInternal as DragRef } from './drag-ref';
import { DndContainerRef } from './dnd-container-ref';
import { SortPositionStrategy } from '../position-strategy/sort-position-strategy';

/**
 * Reference to a drop list. Used to manipulate or dispose of the container.
 */
export class DropFlexContainerRef<T = any> extends DndContainerRef<T> {

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

}
