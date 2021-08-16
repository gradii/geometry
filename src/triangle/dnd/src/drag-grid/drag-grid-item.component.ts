/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
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
  selector: 'tri-drag-resize-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #content style="position: absolute;top: 0;right: 0;bottom: 0;left: 0;" [style.padding.px]="outMargin/2">
      <ng-content></ng-content>
    </div>
    <div>
      <div triDrag #s 
          [style.width.px]="x2-x"
          (triDragMoved)="onDragSMoved($event)"
          triDragLockAxis="y"
          style="transform: translateY(-50%) "
          class="gridster-item-resizable-handler handle-s"></div>
      <div triDrag #e 
          [style.height.px]="y2-y"
          (triDragMoved)="onDragEMoved($event)"
          triDragLockAxis="x"
          style="transform: translateX(-50%) "
          class="gridster-item-resizable-handler handle-e"></div>
      <div triDrag #n 
          [style.width.px]="x2-x"
          (triDragMoved)="onDragNMoved($event)"
          triDragLockAxis="y"
          style="transform: translateY(-50%) "
          class="gridster-item-resizable-handler handle-n"></div>
      <div triDrag #w 
          [style.height.px]="y2-y"
          (triDragMoved)="onDragWMoved($event)"
          triDragLockAxis="x"
          class="gridster-item-resizable-handler handle-w"></div>
      <div triDrag #se
          (triDragMoved)="onDragSeMoved($event)"
          class="gridster-item-resizable-handler handle-se"></div>
      <div triDrag #ne
          (triDragMoved)="onDragNeMoved($event)"
          class="gridster-item-resizable-handler handle-ne"></div>
      <div triDrag #sw
          (triDragMoved)="onDragSwMoved($event)"
          class="gridster-item-resizable-handler handle-sw"></div>
      <div triDrag #nw
          (triDragMoved)="onDragNwMoved($event)"
          class="gridster-item-resizable-handler handle-nw"></div>
    </div>
  `,
  providers: [
    {
      provide: TRI_DROP_CONTAINER, useValue: null
    }
  ],
  host: {
    'class': 'tri-drag-resize-container',
    '[style.inset.px]': '-outMargin/2',
  },
  styles: [
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

  x2: number = 0;
  y2: number = 0;

  @ViewChild('content', { read: ElementRef })
  contentElementRef: ElementRef;


  @ViewChild('n', { read: TriDrag })
  northDrag: TriDrag;

  @ViewChild('s', { read: TriDrag })
  southDrag: TriDrag;

  @ViewChild('e', { read: TriDrag })
  eastDrag: TriDrag;

  @ViewChild('w', { read: TriDrag })
  westDrag: TriDrag;

  @ViewChild('se', { read: TriDrag })
  southEastDrag: TriDrag;

  @ViewChild('ne', { read: TriDrag })
  northEastDrag: TriDrag;

  @ViewChild('sw', { read: TriDrag })
  southWestDrag: TriDrag;

  @ViewChild('nw', { read: TriDrag })
  northWestDrag: TriDrag;

  @Input()
  width: number = 0;

  @Input()
  height: number = 0;

  @Input()
  outMargin: number = 0;

  constructor(private _cdRef: ChangeDetectorRef) {

  }

  _setDragPosition(drag, pointer) {
    if (drag && drag._dragRef && !drag._dragRef.isDragging()) {
      drag._dragRef.setFreeDragPosition(pointer);
    }

    if (ngDevMode) {
      console.error('should not call this function when view is not ready');
    }
  }

  _setItemsPosition() {
    this.northDrag._dragRef.getRootElement().style.width = `${this.x2 - this.x}px`;
    this.eastDrag._dragRef.getRootElement().style.height = `${this.y2 - this.y}px`;
    this.southDrag._dragRef.getRootElement().style.width = `${this.x2 - this.x}px`;
    this.westDrag._dragRef.getRootElement().style.height = `${this.y2 - this.y}px`;

    this._setDragPosition(this.northDrag, { x: this.x, y: this.y });
    this._setDragPosition(this.eastDrag, { x: this.x2, y: this.y });
    this._setDragPosition(this.southDrag, { x: this.x, y: this.y2 });
    this._setDragPosition(this.westDrag, { x: this.x, y: this.y });

    this._setDragPosition(this.northWestDrag, { x: this.x, y: this.y });
    this._setDragPosition(this.northEastDrag, { x: this.x2, y: this.y });
    this._setDragPosition(this.southWestDrag, { x: this.x, y: this.y2 });
    this._setDragPosition(this.southEastDrag, { x: this.x2, y: this.y2 });

    this.contentElementRef.nativeElement.style.transform = `translate(${this.x}px, ${this.y}px)`;
    this.contentElementRef.nativeElement.style.width = `${this.x2-this.x}px`;
    this.contentElementRef.nativeElement.style.height = `${this.y2-this.y}px`;

    // this.northDrag?._dragRef.setFreeDragPosition({x: this.x, y: this.y});
    // this.eastDrag?._dragRef.setFreeDragPosition({x: this.x + this._calculatedWidth, y: this.y});
    // this.southDrag?._dragRef.setFreeDragPosition({x: this.x, y: this.y + this._calculatedHeight});
    // this.westDrag?._dragRef.setFreeDragPosition({x: this.x, y: this.y});

    // // this.northWestDrag?._dragRef.setFreeDragPosition({x: this.x, y: this.y});
    // this.northEastDrag?._dragRef.setFreeDragPosition({x: this.x + this._calculatedWidth, y: this.y});
    // // this.southWestDrag?._dragRef.setFreeDragPosition({x: this.x, y: this.y + this._calculatedHeight});
    // this.southEastDrag?._dragRef.setFreeDragPosition({x: this.x + this._calculatedWidth, y: this.y + this._calculatedHeight});
  }

  onDragSMoved(event: TriDragMove) {
    console.log(event);

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.y2 = dragPosition.y;
    this._setItemsPosition()
  }

  onDragNMoved(event: TriDragMove) {
    console.log(event);

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.y = dragPosition.y;
    this._setItemsPosition()
  }

  onDragWMoved(event: TriDragMove) {
    console.log(event);

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.x = dragPosition.x;
    this._setItemsPosition()
  }

  onDragEMoved(event: TriDragMove) {
    console.log(event);

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.x2 = dragPosition.x;
    this._setItemsPosition()
  }

  onDragSwMoved(event: TriDragMove) {
    console.log(event);

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.x = dragPosition.x;
    this.y2 = dragPosition.y;
    this._setItemsPosition()
  }

  onDragNwMoved(event: TriDragMove) {
    console.log(event);

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.x = dragPosition.x;
    this.y = dragPosition.y;
    this._setItemsPosition()
  }

  onDragSeMoved(event: TriDragMove) {
    console.log(event);

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.x2 = dragPosition.x;
    this.y2 = dragPosition.y;
    this._setItemsPosition()
  }

  onDragNeMoved(event: TriDragMove) {
    console.log(event);

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.y = dragPosition.y;
    this.x2 = dragPosition.x;
    this._setItemsPosition()
  }

  recalculateXy() {
    this.x2 = this.x + this.width + this.outMargin;
    this.y2 = this.y + this.height + this.outMargin;
  }

  ngOnInit() {
    this.recalculateXy()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['height'] && !changes['height'].firstChange ||
      changes['width'] && !changes['width'].firstChange ||
      changes['outMargin'] && !changes['outMargin'].firstChange) {
      this.recalculateXy()
      this._setItemsPosition()
    }
    if (changes['outMargin']) {
      this._cdRef.detectChanges()
    }
  }

  ngAfterViewInit() {
    this._setItemsPosition();
    this._cdRef.detach();
  }
}


@Component({
  selector: 'tri-drag-grid-item',
  exportAs: 'triDragGridItem',
  template: `
    <tri-drag-resize-container 
        [width]="width" [height]="height"
        [outMargin]="dropContainer.gutter">
      <div triDragHandle class="tri-drag-grid-item-content" style="width: 100%;height: 100%">
        <ng-content></ng-content>
      </div>
    </tri-drag-resize-container>
  `,
  providers: [
    { provide: TRI_DRAG_PARENT, useExisting: TriDragGridItemComponent }
  ],
  host: {
    '[style.position]': '"absolute"',
    '[style.display]': '_init ? "block": null',
    '[style.width.px]': '_init ? width: null',
    '[style.height.px]': '_init ? height: null'
  },
  styles: [
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
  private top: number = 0;

  width: number = 100;
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
    this._init = true;
    const ref = this.dropContainer._dropContainerRef;
    const container = this.dropContainer;

    let currentColumnWidth;
    let currentColumnHeight;
    if (!container.hasPadding) {
      currentColumnWidth = (ref.currentWidth + container.gutter) / container.cols;
      currentColumnHeight = (ref.currentHeight + container.gutter) / container.rows;
    } else {
      currentColumnWidth = (ref.currentWidth - container.gutter) / container.cols;
      currentColumnHeight = (ref.currentHeight - container.gutter) / container.rows;
    }

    const x = clamp(this.x, 0, this.maxItemCols - 1);
    const y = clamp(this.y, 0, this.maxItemRows - 1);

    if (!container.hasPadding) {
      this.left = x * currentColumnWidth;
      this.top = y * currentColumnHeight;
    } else {
      this.left = x * currentColumnWidth + container.gutter;
      this.top = y * currentColumnHeight + container.gutter;
    }
    this.width = this.cols * currentColumnWidth - container.gutter;
    this.height = this.rows * currentColumnHeight - container.gutter;

    this._dragRef.setProgramDragPosition({ x: this.left, y: this.top });
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
