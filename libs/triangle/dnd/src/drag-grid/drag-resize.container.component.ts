/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter,
  Inject, Input, OnChanges, OnInit, Optional, Output, SimpleChanges, SkipSelf
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { TriDrag } from '../directives/drag';
import { TRI_DROP_CONTAINER } from '../directives/drop-container';
import { TriDropContainerInternal as TriDropContainer } from '../directives/drop-list-container';
import { DragDrop } from '../drag-drop';
import { DragRef, Point } from '../drag-drop-ref/drag-ref';
import { TRI_DRAG_PARENT } from '../drag-parent';

declare const ngDevMode: boolean;


export interface TriDragResizeStart {
  source: TriDragResizeContainerComponent;
  dragEvent: { source: DragRef };
}

export interface TriDragResize {
  source: TriDragResizeContainerComponent;
  dragEvent: { source: DragRef };
  x: number;
  y: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

export interface TriDragResizeEnd {
  source: TriDragResizeContainerComponent;
  dragEvent: { source: DragRef };
  x: number;
  y: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

@Component({
  selector       : 'tri-drag-resize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <div #placeholder *ngIf="!disabled"
         style="position: absolute;"
         class="tri-drag-resize-placeholder"></div>
  `,
  providers      : [
    {
      provide: TRI_DROP_CONTAINER, useValue: null
    }
  ],
  host           : {
    'class'                           : 'tri-drag-resize-container',
    '[class.tri-drag-resize-resizing]': 'resizing',
    '[style.top.px]'                  : '-rowMargin/2',
    '[style.bottom.px]'               : '-rowMargin/2',
    '[style.left.px]'                 : '-columnMargin/2',
    '[style.right.px]'                : '-columnMargin/2',
  },
  styleUrls      : [`../../style/drag-resize.scss`]
})
export class TriDragResizeContainerComponent implements OnInit, OnChanges, AfterViewInit {
  x: number = 0;
  y: number = 0;

  x2: number = 0;
  y2: number = 0;

  resizing: boolean = false;

  placeholderElement: HTMLElement;

  northDragRef: DragRef;
  southDragRef: DragRef;
  eastDragRef: DragRef;
  westDragRef: DragRef;

  southEastDragRef: DragRef;
  northEastDragRef: DragRef;
  southWestDragRef: DragRef;
  northWestDragRef: DragRef;

  @Input()
  disabled: boolean = true;

  @Input()
  width: number = 0;

  @Input()
  height: number = 0;

  @Input()
  rowMargin: number = 0;

  @Input()
  columnMargin: number = 0;

  @Output('triDragResizeStarted')
  resizeStarted: EventEmitter<TriDragResizeStart> = new EventEmitter();

  @Output('triDragResized')
  resized: EventEmitter<TriDragResize> = new EventEmitter();

  @Output('triDragResizeEnded')
  resizeEnded: EventEmitter<TriDragResizeEnd> = new EventEmitter();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _dragDrop: DragDrop,
    private _elementRef: ElementRef,
    @Inject(TRI_DROP_CONTAINER) @Optional() @SkipSelf() public dropContainer: TriDropContainer,
    @Optional() @SkipSelf() @Inject(TRI_DRAG_PARENT) protected _parentDrag?: TriDrag,
  ) {
  }

  getPlaceHolderElement() {
    return this.placeholderElement;
  }

  _setDragPosition(dragRef: DragRef, pointer: Point) {
    if (dragRef && !dragRef.isDragging()) {
      dragRef.setFreeDragPosition(pointer);
    }

    if (ngDevMode && !dragRef) {
      console.error('should not call this function when view is not ready');
    }
  }

  _runSetItemsPosition$ = new Subject();

  _setItemsPosition() {
    this._runSetItemsPosition$.next();
  }

  _runSetItemsPosition() {
    if (this.disabled) {
      return;
    }

    if (this.northDragRef) {
      this.northDragRef.getRootElement().style.width = `${this.x2 - this.x}px`;
    }

    if (this.eastDragRef) {
      this.eastDragRef.getRootElement().style.height = `${this.y2 - this.y}px`;
    }

    if (this.southDragRef) {
      this.southDragRef.getRootElement().style.width = `${this.x2 - this.x}px`;
    }

    if (this.westDragRef) {
      this.westDragRef.getRootElement().style.height = `${this.y2 - this.y}px`;
    }

    this._setDragPosition(this.northDragRef, {x: this.x, y: this.y});
    this._setDragPosition(this.eastDragRef, {x: this.x2, y: this.y});
    this._setDragPosition(this.southDragRef, {x: this.x, y: this.y2});
    this._setDragPosition(this.westDragRef, {x: this.x, y: this.y});

    this._setDragPosition(this.northWestDragRef, {x: this.x, y: this.y});
    this._setDragPosition(this.northEastDragRef, {x: this.x2, y: this.y});
    this._setDragPosition(this.southWestDragRef, {x: this.x, y: this.y2});
    this._setDragPosition(this.southEastDragRef, {x: this.x2, y: this.y2});

    // if (this.contentElementRef) {
    //   this.contentElementRef.nativeElement.style.transform = `translate(${this.x}px, ${this.y}px)`;
    //   this.contentElementRef.nativeElement.style.width     = `${this.x2 - this.x}px`;
    //   this.contentElementRef.nativeElement.style.height    = `${this.y2 - this.y}px`;
    // }
  }

  onDragStarted(event: { source: DragRef }) {
    this.resizing = true;
    this.resizeStarted.emit({
      source: this, dragEvent: event
    });
  }

  onDragResize(event: { source: DragRef }, from: string) {
    this.resized.emit({
      source: this, dragEvent: event,
      x     : this.x, y: this.y,
      x2    : this.x2 - this.columnMargin, y2: this.y2 - this.rowMargin,
      width : this.x2 - this.x,
      height: this.y2 - this.y
    });
  }

  onDragEnded(event: { source: DragRef }) {
    this.resizing = false;
    this.resizeEnded.emit({
      source: this, dragEvent: event,
      x     : this.x, y: this.y,
      x2    : this.x2 - this.columnMargin, y2: this.y2 - this.rowMargin,
      width : this.x2 - this.x,
      height: this.y2 - this.y
    });
  }

  onDragSMoved(event: { source: DragRef }) {

    const dragPosition = event.source.getFreeDragPosition();
    this.y2            = dragPosition.y;
    this._setItemsPosition();
    this.onDragResize(event, 's');
  }

  onDragNMoved(event: { source: DragRef }) {

    const dragPosition = event.source.getFreeDragPosition();
    this.y             = dragPosition.y;
    this._setItemsPosition();
    this.onDragResize(event, 'n');
  }

  onDragWMoved(event: { source: DragRef }) {

    const dragPosition = event.source.getFreeDragPosition();
    this.x             = dragPosition.x;
    this._setItemsPosition();
    this.onDragResize(event, 'w');
  }

  onDragEMoved(event: { source: DragRef }) {

    const dragPosition = event.source.getFreeDragPosition();
    this.x2            = dragPosition.x;
    this._setItemsPosition();
    this.onDragResize(event, 'e');
  }

  onDragSwMoved(event: { source: DragRef }) {

    const dragPosition = event.source.getFreeDragPosition();
    this.x             = dragPosition.x;
    this.y2            = dragPosition.y;
    this._setItemsPosition();
    this.onDragResize(event, 'sw');
  }

  onDragNwMoved(event: { source: DragRef }) {

    const dragPosition = event.source.getFreeDragPosition();
    this.x             = dragPosition.x;
    this.y             = dragPosition.y;
    this._setItemsPosition();
    this.onDragResize(event, 'nw');
  }

  onDragSeMoved(event: { source: DragRef }) {

    const dragPosition = event.source.getFreeDragPosition();
    this.x2            = dragPosition.x;
    this.y2            = dragPosition.y;
    this._setItemsPosition();
    this.onDragResize(event, 'se');
  }

  onDragNeMoved(event: { source: DragRef }) {

    const dragPosition = event.source.getFreeDragPosition();
    this.y             = dragPosition.y;
    this.x2            = dragPosition.x;
    this._setItemsPosition();
    this.onDragResize(event, 'ne');
  }

  recalculateXy() {
    this.x2 = this.x + this.width + this.columnMargin;
    this.y2 = this.y + this.height + this.rowMargin;
  }

  reset() {
    this.x  = 0;
    this.y  = 0;
    this.x2 = this.x + this.width + this.columnMargin;
    this.y2 = this.y + this.height + this.rowMargin;
    this._setItemsPosition();
    this._cdRef.detectChanges();
  }

  _bindDragRef(position: string) {
    const dragElement = document.createElement('div');
    dragElement.classList.add('gridster-item-resizable-handler', `handle-${position}`);

    this._elementRef.nativeElement.append(dragElement);

    const dragRef = this._dragDrop.createDrag(dragElement)
      .withRootElement(dragElement)
      .withParent(this._parentDrag?._dragRef);

    dragRef.started.subscribe(event => this.onDragStarted(event));
    dragRef.moved.subscribe(
      event => {
        if (position === 's') {
          this.onDragSMoved(event);
        } else if (position === 'n') {
          this.onDragNMoved(event);
        } else if (position === 'w') {
          this.onDragWMoved(event);
        } else if (position === 'e') {
          this.onDragEMoved(event);
        } else if (position === 'sw') {
          this.onDragSwMoved(event);
        } else if (position === 'nw') {
          this.onDragNwMoved(event);
        } else if (position === 'se') {
          this.onDragSeMoved(event);
        } else if (position === 'ne') {
          this.onDragNeMoved(event);
        }
      });
    dragRef.ended.subscribe(event => this.onDragEnded(event));
    return dragRef;
  }

  ngOnInit() {
    this.recalculateXy();

    this.southDragRef          = this._bindDragRef('s');
    this.southDragRef.lockAxis = 'y';
    this.northDragRef          = this._bindDragRef('n');
    this.northDragRef.lockAxis = 'y';
    this.eastDragRef           = this._bindDragRef('e');
    this.eastDragRef.lockAxis  = 'x';
    this.westDragRef           = this._bindDragRef('w');
    this.westDragRef.lockAxis  = 'x';

    this.southEastDragRef = this._bindDragRef('se');
    this.northEastDragRef = this._bindDragRef('ne');
    this.southWestDragRef = this._bindDragRef('sw');
    this.northWestDragRef = this._bindDragRef('nw');

    this.placeholderElement = document.createElement('div');
    this.placeholderElement.classList.add('tri-drag-resize-placeholder');

    this._elementRef.nativeElement.append(this.placeholderElement);

    this.updatePlaceholder();
    this._runSetItemsPosition$.pipe(
      debounceTime(10),
      tap(() => {
        this._runSetItemsPosition();
      })
    ).subscribe();
  }

  updatePlaceholder() {
    // if (this.disabled) {
    //   return;
    // }
    this.placeholderElement.style.top    = `${this.rowMargin / 2}px`;
    this.placeholderElement.style.bottom = `${this.rowMargin / 2}px`;
    this.placeholderElement.style.left   = `${this.columnMargin / 2}px`;
    this.placeholderElement.style.right  = `${this.columnMargin / 2}px`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['height'] && !changes['height'].firstChange ||
      changes['width'] && !changes['width'].firstChange ||
      changes['rowMargin'] && !changes['rowMargin'].firstChange ||
      changes['columnMargin'] && !changes['columnMargin'].firstChange ||
      changes['disabled']) {
      this.recalculateXy();
      this._setItemsPosition();
    }

    if (changes['rowMargin'] && !changes['rowMargin'].firstChange ||
      changes['columnMargin'] && !changes['columnMargin'].firstChange) {
      this.updatePlaceholder();
    }

    if (changes['rowMargin'] || changes['columnMargin'] || changes['disabled']) {
      this._cdRef.detectChanges();
    }
  }

  ngAfterViewInit() {
    this._setItemsPosition();
    this._cdRef.detach();
  }
}
