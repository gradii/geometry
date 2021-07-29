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
import { clamp } from '@gradii/triangle/util';

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
    '[style.width.px]' : 'width',
    '[style.height.px]': 'height'
  }
})
export class TriDragGridItemComponent extends TriDrag implements OnInit, OnDestroy {

  @Input('triDragGridItemX')
  x: number;

  @Input('triDragGridItemY')
  y: number;

  @Input('triDragGridItemRows')
  rows: number = 1;

  @Input('triDragGridItemCols')
  cols: number = 1;

  @Input('triDragGridItemLayerIndex')
  layerIndex?: number;
  // dragEnabled?: boolean;
  // resizeEnabled?: boolean;
  // compactEnabled?: boolean;
  @Input('triDragGridItemMinItemCols')
  minItemCols: number = 1;

  @Input('triDragGridItemMaxItemCols')
  maxItemCols: number = 50;

  @Input('triDragGridItemMinItemRows')
  minItemRows: number = 1;

  @Input('triDragGridItemMaxItemRows')
  maxItemRows: number = 50;

  @Input('triDragGridItemMinItemArea')
  minItemArea: number = 1;

  @Input('triDragGridItemMaxItemArea')
  maxItemArea: number = 2500;

  @Input('triDragGridItemDragEnabled')
  dragEnabled: boolean = true;

  @Input('triDragGridItemResizeEnabled')
  resizeEnabled: boolean = true;

  @Input('triDragGridItemCompactEnabled')
  compactEnabled: boolean = true;

  programDragPosition: { x: number, y: number };

  private left: number   = 0;
  private top: number    = 0;
  private width: number  = 100;
  private height: number = 100;

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

  _assignDefaults(config: DragDropConfig) {
    super._assignDefaults(config);
    const {
            defaultLayerIndex,
            defaultItemCols,
            defaultItemRows,
            minItemCols,
            maxItemCols,
            minItemRows,
            maxItemRows,
            minItemArea,
            maxItemArea,
          } = config;

    if (defaultLayerIndex) {
      this.layerIndex = defaultLayerIndex;
    }
    if (defaultItemCols) {
      this.cols = defaultItemCols;
    }
    if (defaultItemRows) {
      this.rows = defaultItemRows;
    }
    if (minItemCols) {
      this.minItemCols = minItemCols;
    }
    if (maxItemCols) {
      this.maxItemCols = maxItemCols;
    }
    if (minItemRows) {
      this.minItemRows = minItemRows;
    }
    if (maxItemRows) {
      this.maxItemRows = maxItemRows;
    }
    if (minItemArea) {
      this.minItemArea = minItemArea;
    }
    if (maxItemArea) {
      this.maxItemArea = maxItemArea;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (
      changes['x'] || changes['y'] ||
      changes['rows'] || changes['cols']
    ) {
      this.updateItemSize();
    }
  }

  updateItemSize(): void {
    const ref       = this.dropContainer._dropContainerRef;
    const container = this.dropContainer;

    const withMargin = true;
    let currentColumnWidth;
    let currentColumnHeight;
    if (!withMargin) {
      currentColumnWidth  = (ref.currentWidth + container.gutter) / container.cols;
      currentColumnHeight = (ref.currentHeight + container.gutter) / container.rows;
    } else {
      currentColumnWidth  = (ref.currentWidth - container.gutter) / container.cols;
      currentColumnHeight = (ref.currentHeight - container.gutter) / container.rows;
    }

    const x = clamp(this.x, 0, this.maxItemCols - 1);
    const y = clamp(this.y, 0, this.maxItemRows - 1);

    if (!withMargin) {
      this.left = x * currentColumnWidth;
      this.top  = y * currentColumnHeight;
    } else {
      this.left = x * currentColumnWidth + container.gutter;
      this.top  = y * currentColumnHeight + container.gutter;
    }
    this.width  = this.cols * currentColumnWidth - container.gutter;
    this.height = this.rows * currentColumnHeight - container.gutter;

    this._dragRef.setProgramDragPosition({x: this.left, y: this.top});
    this._changeDetectorRef.markForCheck();

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
    this.updateItemSize();

    this.programDragPosition = {x: this.left, y: this.top};
  }

  ngAfterViewInit() {

    super.ngAfterViewInit();
  }


}
