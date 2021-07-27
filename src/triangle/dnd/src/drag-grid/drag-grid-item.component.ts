/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, Optional, Self, SimpleChanges,
  SkipSelf,
  ViewContainerRef
} from '@angular/core';
import { TriDropGridContainer } from '../directives/drop-grid-container';

import { TriDrag } from '../directives/drag';
import { TRI_DRAG_PARENT } from '../drag-parent';
import { TRI_DROP_CONTAINER } from '../directives/drop-container';
import { DragDropConfig, TRI_DRAG_CONFIG } from '../directives/config';
import { DragDrop } from '../drag-drop';
import { TriDragHandle, TRI_DRAG_HANDLE } from '../directives/drag-handle';


@Component({
  selector : 'tri-drag-grid-item',
  exportAs : 'triDragGridItem',
  template : `
    <div>
      <ng-content></ng-content>
    </div>
    <div class="gridster-item-resizable-handler handle-s"></div>
    <div class="gridster-item-resizable-handler handle-e"></div>
    <div class="gridster-item-resizable-handler handle-n"></div>
    <div class="gridster-item-resizable-handler handle-w"></div>
    <div class="gridster-item-resizable-handler handle-se"></div>
    <div class="gridster-item-resizable-handler handle-ne"></div>
    <div class="gridster-item-resizable-handler handle-sw"></div>
    <div class="gridster-item-resizable-handler handle-nw"></div>
  `,
  providers: [
    {provide: TRI_DRAG_PARENT, useExisting: TriDragGridItemComponent}
  ],
  host     : {
    '[style.position]' : '"absolute"',
    '[style.width.px]' : 'size.width',
    '[style.height.px]': 'size.height'
  }
})
export class TriDragGridItemComponent extends TriDrag implements OnInit, OnDestroy {

  @Input('triDragGridItemRows')
  rows: number = 1;

  @Input('triDragGridItemCols')
  cols: number = 1;

  @Input('triDragGridItemX')
  x: number;

  @Input('triDragGridItemY')
  y: number;

  @Input('triDragGridItemLayerIndex')
  layerIndex?: number;
  // dragEnabled?: boolean;
  // resizeEnabled?: boolean;
  // compactEnabled?: boolean;
  @Input('triDragGridItemMaxRows')
  maxRows: number;
  @Input('triDragGridItemMinRows')
  minRows: number;
  @Input('triDragGridItemMaxCols')
  maxCols: number;
  @Input('triDragGridItemMinCols')
  minCols: number;
  @Input('triDragGridItemMinArea')
  minArea: number;
  @Input('triDragGridItemMaxArea')
  maxArea: number;

  @Input('triDragGridItemCompactEnabled')
  compactEnabled: boolean = true;

  _position: { x: number, y: number };

  programDragPosition: { x: number, y: number };

  size: { width: number, height: number } = {width: 100, height: 100};

  constructor(
    private gridster: TriDropGridContainer,
    /** Element that the draggable is attached to. */
    public element: ElementRef<HTMLElement>,
    /** Droppable container that the draggable is a part of. */
    @Inject(TRI_DROP_CONTAINER) @SkipSelf() public dropContainer: TriDropGridContainer,
    protected _ngZone: NgZone,
    protected _viewContainerRef: ViewContainerRef,
    @Optional() @Inject(TRI_DRAG_CONFIG) config: DragDropConfig,
    @Optional() protected _dir: Directionality, dragDrop: DragDrop,
    protected _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Self() @Inject(TRI_DRAG_HANDLE) protected _selfHandle?: TriDragHandle,
    @Optional() @SkipSelf() @Inject(TRI_DRAG_PARENT) protected _parentDrag?: TriDrag
  ) {
    super(
      element, dropContainer, _ngZone, _viewContainerRef,
      config, _dir, dragDrop, _changeDetectorRef, _selfHandle, _parentDrag
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (
      changes['x'] || changes['y'] || changes['rows'] || changes['cols']
    ) {
      this.updateItemSize();
    }
  }

  updateItemSize(): void {
    // const top    = this.y * this.gridster.curRowHeight;
    // const left   = this.x * this.gridster.curColWidth;
    // const width  = this.cols * this.gridster.curColWidth - this.gridster.$options.margin;
    // const height = this.rows * this.gridster.curRowHeight - this.gridster.$options.margin;
    //
    // this.top  = top;
    // this.left = left;
    //
    // if (!this.init && width > 0 && height > 0) {
    //   this.init = true;
    //   if (this.item.initCallback) {
    //     this.item.initCallback(this.item, this);
    //   }
    //   if (this.gridster.options.itemInitCallback) {
    //     this.gridster.options.itemInitCallback(this.item, this);
    //   }
    //   if (this.gridster.$options.scrollToNewItems) {
    //     this.el.scrollIntoView(false);
    //   }
    // }
    // if (width !== this.width || height !== this.height) {
    //   this.width  = width;
    //   this.height = height;
    //   if (this.gridster.options.itemResizeCallback) {
    //     this.gridster.options.itemResizeCallback(this.item, this);
    //   }
    // }
  }

  ngOnInit() {
    console.log(this.dropContainer._dropContainerRef);
    const ref      = this.dropContainer._dropContainerRef;
    const position = {x: 0, y: 0};
    if (this.x > 0) {
      position.x = this.x * ref.currentColumnWidth;
    }
    if (this.y > 0) {
      position.y = this.y * ref.currentRowHeight;
    }
    if (this.cols > 0) {
      this.size.width = this.cols * ref.currentColumnWidth;
    }
    if (this.rows > 0) {
      this.size.height = this.rows * ref.currentRowHeight;
    }
    this.programDragPosition = position;
  }

  ngAfterViewInit() {

    super.ngAfterViewInit();
  }


}
