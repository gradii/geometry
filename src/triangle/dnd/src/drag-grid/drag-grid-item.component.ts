/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, Optional,
  Self, SimpleChanges, SkipSelf, ViewChild, ViewContainerRef
} from '@angular/core';
import { clamp } from '@gradii/triangle/util';
import { DragDropConfig, TRI_DRAG_CONFIG } from '../directives/config';

import { TriDrag } from '../directives/drag';
import { TRI_DRAG_HANDLE, TriDragHandle } from '../directives/drag-handle';
import { TRI_DROP_CONTAINER } from '../directives/drop-container';
import { TriDropGridContainer } from '../directives/drop-grid-container';
import { DragDrop } from '../drag-drop';
import { TRI_DRAG_PARENT } from '../drag-parent';
import { TriDragMove } from '../event/drag-events';

@Component({
  selector : 'tri-drag-resize-container',
  template : `
    <div triDrag [style.width.px]="_calculatedWidth"
         (triDragMoved)="onDragSMoved($event)"
         triDragLockAxis="y"
         style="transform: translateY(-50%) translate(0, {{height+outMargin}}px)"
         class="gridster-item-resizable-handler handle-s"></div>
    <div triDrag [style.height.px]="_calculatedHeight"
         (triDragMoved)="onDragEMoved($event)"
         triDragLockAxis="x"
         style="transform: translateX(-50%) translate({{_calculatedWidth}}px, 0)"
         class="gridster-item-resizable-handler handle-e"></div>
    <div triDrag [style.width.px]="_calculatedWidth"
         (triDragMoved)="onDragNMoved($event)"
         triDragLockAxis="y"
         style="transform: translateY(-50%) translate(0, 0)"
         class="gridster-item-resizable-handler handle-n"></div>
    <div triDrag [style.height.px]="_calculatedHeight"
         (triDragMoved)="onDragWMoved($event)"
         triDragLockAxis="x"
         [triDragFreeDragPosition]="{x:0,y:0}"
         style="transform: translateX(-50%) translate(0, 0)"
         class="gridster-item-resizable-handler handle-w"></div>
    <div triDrag
         (triDragMoved)="onDragSeMoved($event)"
         style="transform: translate({{_calculatedWidth}}px, {{_calculatedHeight}}px)"
         class="gridster-item-resizable-handler handle-se"></div>
    <div triDrag
         (triDragMoved)="onDragNeMoved($event)"
         style="transform: translate({{_calculatedWidth}}px, 0px)"
         class="gridster-item-resizable-handler handle-ne"></div>
    <div triDrag
         (triDragMoved)="onDragSwMoved($event)"
         style="transform: translate(0px, {{_calculatedHeight}}px)"
         class="gridster-item-resizable-handler handle-sw"></div>
    <div triDrag
         (triDragMoved)="onDragNwMoved($event)"
         style="transform: translate(0px, 0px)"
         class="gridster-item-resizable-handler handle-nw"></div>
  `,
  providers: [
    {
      provide: TRI_DROP_CONTAINER, useValue: null
    }
  ],
  host     : {
    'class'            : 'tri-drag-resize-container',
    '[style.top.px]'   : '-outMargin/2',
    '[style.left.px]'  : '-outMargin/2',
    '[style.bottom.px]': '-outMargin/2 ',
    '[style.right.px]' : '-outMargin/2 '
  },
  styles   : [
    `
      ::ng-deep .tri-drag-placeholder .tri-drag-resize-container {
        display : none;
      }

      :host {
        display    : block;
        position   : absolute;
        top        : 0;
        left       : 0;
        bottom     : 0;
        right      : 0;
        background : rgb(30 143 233 / 13%);
        z-index    : -1;
      }

      .gridster-item-resizable-handler {
        position   : absolute;
        z-index    : 2;
        background : #1e89ef;
        left       : 0;
        top        : 0;
      }

      .gridster-item-resizable-handler.handle-n {
        cursor    : ns-resize;
        height    : 2px;

        transform : translate3d(0, -50%, 0)
      }

      .gridster-item-resizable-handler.handle-e {
        cursor : ew-resize;
        width  : 2px;
      }

      .gridster-item-resizable-handler.handle-s {
        cursor : ns-resize;
        height : 2px;
      }

      .gridster-item-resizable-handler.handle-w {
        cursor : ew-resize;
        width  : 2px;
      }

      .gridster-item-resizable-handler.handle-ne {
        cursor        : ne-resize;
        width         : 10px;
        height        : 10px;
        border-radius : 50%;
        margin-top    : -5px;
        margin-left   : -5px;
      }

      .gridster-item-resizable-handler.handle-nw {
        cursor        : nw-resize;
        width         : 10px;
        height        : 10px;
        border-radius : 50%;
        margin-top    : -5px;
        margin-left   : -5px;
      }

      .gridster-item-resizable-handler.handle-se {
        cursor        : se-resize;
        width         : 10px;
        height        : 10px;
        border-radius : 50%;
        margin-top    : -5px;
        margin-left   : -5px;
      }

      .gridster-item-resizable-handler.handle-sw {
        cursor        : sw-resize;
        width         : 10px;
        height        : 10px;
        border-radius : 50%;
        margin-top    : -5px;
        margin-left   : -5px;
      }

      gridster-item:hover .gridster-item-resizable-handler.handle-se {
        border-color : transparent transparent #ccc
      }

    `
  ]
})
export class TriDragResizeContainer {


  x: number = 0;
  y: number = 0;

  private _width: number       = 200;
  private _height: number      = 100;
  private _deltaWidth: number  = 0;
  private _deltaHeight: number = 0;
  _calculatedHeight: number    = 0;
  _calculatedWidth: number     = 0;

  @Input()
  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    this._calculateWidth();
  }

  @Input()
  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
    this._calculateHeight();
  }

  get deltaWidth(): number {
    return this._deltaWidth;
  }

  set deltaWidth(value: number) {
    this._deltaWidth = value;
    this._calculateWidth();
  }

  get deltaHeight(): number {
    return this._deltaHeight;
  }

  set deltaHeight(value: number) {
    this._deltaHeight = value;
    this._calculateHeight();
  }

  @Input()
  outMargin: number = 0;

  private _calculateHeight() {
    this._calculatedHeight = this._height + this._deltaHeight + this.outMargin;
  }

  private _calculateWidth() {
    this._calculatedWidth = this._width + this._deltaWidth + this.outMargin;
  }


  onDragSMoved(event: TriDragMove) {
    console.log(event);
    this.deltaHeight = event.distance.y;
  }

  onDragNMoved(event: TriDragMove) {
    console.log(event);
    this.y           = event.distance.y;
    this.deltaHeight = event.distance.y;
  }

  onDragWMoved(event: TriDragMove) {
    console.log(event);
    this.x          = event.distance.x;
    this.deltaWidth = event.distance.x;
  }

  onDragEMoved(event: TriDragMove) {
    console.log(event);
    this.deltaWidth = event.distance.x;
  }

  onDragSwMoved(event: TriDragMove) {
    console.log(event);
    this.x           = event.distance.x;
    this.deltaHeight = event.distance.y;
    this.deltaWidth  = event.distance.x;
  }

  onDragNwMoved(event: TriDragMove) {
    console.log(event);
    this.x           = event.distance.x;
    this.y           = event.distance.y;
    this.deltaHeight = event.distance.y;
    this.deltaWidth  = event.distance.x;
  }

  onDragSeMoved(event: TriDragMove) {
    console.log(event);
    this.deltaHeight = event.distance.y;
    this.deltaWidth  = event.distance.x;
  }

  onDragNeMoved(event: TriDragMove) {
    console.log(event);
    this.y           = event.distance.y;
    this.deltaHeight = event.distance.y;
    this.deltaWidth  = event.distance.x;
  }
}


@Component({
  selector : 'tri-drag-grid-item',
  exportAs : 'triDragGridItem',
  template : `
    <div triDragHandle class="tri-drag-grid-item-content" style="width: 100%;height: 100%">
      <ng-content></ng-content>
    </div>
    <tri-drag-resize-container [width]="width" [height]="height"
                               [outMargin]="dropContainer.gutter"></tri-drag-resize-container>
  `,
  providers: [
    {provide: TRI_DRAG_PARENT, useExisting: TriDragGridItemComponent}
  ],
  host     : {
    '[style.position]' : '"absolute"',
    '[style.display]'  : '_init ? "block": null',
    '[style.width.px]' : '_init ? width: null',
    '[style.height.px]': '_init ? height: null'
  },
  styles   : [
    `
      :host {
        box-sizing  : border-box;
        z-index     : 1;
        position    : absolute;
        overflow    : hidden;
        transition  : .3s;
        display     : none;
        user-select : text;
      }

      .tri-drag-grid-item-content {
        background : white;
      }
    `
  ]
})
export class TriDragGridItemComponent extends TriDrag implements OnInit, OnDestroy {

  private lastPositionX: number;
  private lastPositionY: number;

  @Input('triDragGridItemX')
  x: number = -1;

  @Input('triDragGridItemY')
  y: number = -1;

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

  private _compactEnabled: boolean = true;

  @Input('triDragGridItemCompactEnabled')
  get compactEnabled(): boolean {
    return this._compactEnabled;
  }

  set compactEnabled(value: boolean) {
    this._compactEnabled = coerceBooleanProperty(value);
  }


  notPlaced: boolean = false;

  programDragPosition: { x: number, y: number };

  private left: number = 0;
  private top: number  = 0;

  width: number  = 100;
  height: number = 100;

  _init = false;

  @ViewChild(TriDragResizeContainer)
  dragResizeContainer: TriDragResizeContainer;

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

    if (changes['x']) {
      this.lastPositionX = changes['x'].currentValue;
    }
    if (changes['y']) {
      this.lastPositionY = changes['y'].currentValue;
    }

    if (
      changes['x'] || changes['y'] ||
      changes['rows'] || changes['cols']
    ) {
      // this.updateItemSize();
    }
  }

  updateItemSize(): void {
    this._init      = true;
    const ref       = this.dropContainer._dropContainerRef;
    const container = this.dropContainer;

    let currentColumnWidth;
    let currentColumnHeight;
    if (!container.hasPadding) {
      currentColumnWidth  = (ref.currentWidth + container.gutter) / container.cols;
      currentColumnHeight = (ref.currentHeight + container.gutter) / container.rows;
    } else {
      currentColumnWidth  = (ref.currentWidth - container.gutter) / container.cols;
      currentColumnHeight = (ref.currentHeight - container.gutter) / container.rows;
    }

    const x = clamp(this.x, 0, this.maxItemCols - 1);
    const y = clamp(this.y, 0, this.maxItemRows - 1);

    if (!container.hasPadding) {
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
    this.dropContainer.positionItem(this);

    // this.programDragPosition = {x: this.left, y: this.top};
  }

  ngAfterViewInit() {

    super.ngAfterViewInit();
  }


}
