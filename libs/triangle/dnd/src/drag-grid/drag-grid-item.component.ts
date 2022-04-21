/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit,
  Optional, Self, SimpleChanges, SkipSelf, ViewChild, ViewContainerRef
} from '@angular/core';
import { clamp } from '@gradii/triangle/util';
import { DragDropConfig, TRI_DRAG_CONFIG } from '../directives/config';

import { TriDrag } from '../directives/drag';
import { TRI_DRAG_HANDLE, TriDragHandle } from '../directives/drag-handle';
import { TRI_DROP_CONTAINER } from '../directives/drop-container';
import type { TriDropGridContainer } from '../directives/drop-grid-container';
import { DragDrop } from '../drag-drop';
import { TRI_DRAG_PARENT } from '../drag-parent';
import {
  TriDragResize, TriDragResizeContainerComponent, TriDragResizeEnd, TriDragResizeStart
} from './drag-resize.container.component';

@Component({
  selector : 'tri-drag-grid-item',
  exportAs : 'triDragGridItem',
  template : `
    <tri-drag-resize-container
      [disabled]="!resizeEnabled"
      [width]="width" [height]="height"
      [outMargin]="dropContainer.gutter"
      (triDragResizeStarted)="onDragResizeStart($event)"
      (triDragResized)="onDragResize($event)"
      (triDragResizeEnded)="onDragResizeEnd($event)"
    >
      <div triDragHandle class="tri-drag-grid-item-content" style="width: 100%;height: 100%">
        <ng-content></ng-content>
        {{x}} {{y}}
      </div>
    </tri-drag-resize-container>
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
export class TriDragGridItemComponent extends TriDrag
  implements OnInit, OnChanges, OnDestroy {

  private lastPositionX: number;
  private lastPositionY: number;

  @Input('triDragGridItemIndex')
  index: number = -1;

  @Input('triDragGridItemX')
  x: number = -1;
  renderX: number;

  @Input('triDragGridItemY')
  y: number = -1;
  renderY: number;

  @Input('triDragGridItemRows')
  rows: number = 1;
  renderRows: number;

  @Input('triDragGridItemCols')
  cols: number = 1;
  renderCols: number;

  // itemChanged

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
  resizeEnabled: boolean = false;

  private _compactEnabled: boolean = true;

  @Input('triDragGridItemCompactEnabled')
  get compactEnabled(): boolean {
    return this._compactEnabled;
  }

  set compactEnabled(value: boolean) {
    this._compactEnabled = coerceBooleanProperty(value);
  }


  notPlaced: boolean = false;

  private left: number = 0;
  private top: number  = 0;

  width: number  = 100;
  height: number = 100;

  _init = false;

  @ViewChild(TriDragResizeContainerComponent)
  dragResizeContainer: TriDragResizeContainerComponent;

  constructor(
    @Inject(TRI_DROP_CONTAINER)
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
    @Optional() @Self() @Inject(TRI_DRAG_HANDLE) protected override _selfHandle?: TriDragHandle,
    @Optional() @SkipSelf() @Inject(TRI_DRAG_PARENT) protected override _parentDrag?: TriDrag
  ) {
    super(
      element, dropContainer, _ngZone, _viewContainerRef,
      config, _dir, dragDrop, _changeDetectorRef, _selfHandle, _parentDrag
    );

  }

  onDragResizeStart(event: TriDragResizeStart) {
    console.log('resize start', event);
  }

  onDragResize(event: TriDragResize) {
    console.log('resizing', event);
    const x = this.dropContainer.pixelsToPositionX(this.left + event.x, Math.round);
    const y = this.dropContainer.pixelsToPositionY(this.top + event.y, Math.round);

    const pixelX     = this.dropContainer.positionXToPixels(x);
    const pixelY     = this.dropContainer.positionYToPixels(y);
    const translateX = pixelX - this.left;
    const translateY = pixelY - this.top;

    event.source.getPlaceHolderElement().style.transform = `translate(${translateX}px, ${translateY}px)`;

    // const width                                       = Math.round(
    //   event.width / this.dropContainer.currentTileWidth) * this.dropContainer.currentTileWidth;
    // const height                                      = Math.round(
    //   event.height / this.dropContainer.currentTileHeight) * this.dropContainer.currentTileHeight;
    // event.source.getPlaceHolderElement().style.width  = `${width}px`;
    // event.source.getPlaceHolderElement().style.height = `${height}px`;
  }

  onDragResizeEnd(event: TriDragResizeEnd) {
    // console.log('resize end', event);

    const x = this.dropContainer.pixelsToPositionX(this.left + event.x, Math.round);
    const y = this.dropContainer.pixelsToPositionY(this.top + event.y, Math.round);
    this.x  = x;
    this.y  = y;

    this.cols = Math.round(event.width / this.dropContainer.renderTileWidth);
    this.rows = Math.round(event.height / this.dropContainer.renderTileHeight);

    this._ngZone.run(() => {
      this.dropContainer.positionItem(this);
    });

    event.source.reset();
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
      this.dropContainer.positionItem(this);
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

}
