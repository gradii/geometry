import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

import { TriDrag } from '../directives/drag';
import { TRI_DROP_CONTAINER } from '../directives/drop-container';
import { Point } from '../drag-drop-ref/drag-ref';
import { TriDragEnd, TriDragMove, TriDragStart } from '../event/drag-events';


export interface TriDragResizeStart {
  source: TriDragResizeContainer;
  dragEvent: TriDragStart;
}

export interface TriDragResize {
  source: TriDragResizeContainer;
  dragEvent: TriDragStart;
  x: number;
  y: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

export interface TriDragResizeEnd {
  source: TriDragResizeContainer;
  dragEvent: TriDragStart;
  x: number;
  y: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

@Component({
  selector       : 'tri-drag-resize-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <div #content style="position: absolute;inset: 0;"
         [style.padding.px]="outMargin/2">
      <ng-content></ng-content>
    </div>
    <div #placeholder *ngIf="!disabled" style="position: absolute;inset: 0;"
         class="tri-drag-resize-placeholder"></div>
    <div class="tri-drag-resize-indicator" *ngIf="!disabled">
      <div triDrag #s
           [style.width.px]="x2-x"
           (triDragStarted)="onDragStarted($event)"
           (triDragMoved)="onDragSMoved($event)"
           (triDragEnded)="onDragEnded($event)"
           triDragLockAxis="y"
           style="transform: translateY(-50%) "
           class="gridster-item-resizable-handler handle-s"></div>
      <div triDrag #e
           [style.height.px]="y2-y"
           (triDragStarted)="onDragStarted($event)"
           (triDragMoved)="onDragEMoved($event)"
           (triDragEnded)="onDragEnded($event)"
           triDragLockAxis="x"
           style="transform: translateX(-50%) "
           class="gridster-item-resizable-handler handle-e"></div>
      <div triDrag #n
           [style.width.px]="x2-x"
           (triDragStarted)="onDragStarted($event)"
           (triDragMoved)="onDragNMoved($event)"
           (triDragEnded)="onDragEnded($event)"
           triDragLockAxis="y"
           style="transform: translateY(-50%) "
           class="gridster-item-resizable-handler handle-n"></div>
      <div triDrag #w
           [style.height.px]="y2-y"
           (triDragStarted)="onDragStarted($event)"
           (triDragMoved)="onDragWMoved($event)"
           (triDragEnded)="onDragEnded($event)"
           triDragLockAxis="x"
           style="transform: translateX(-50%) "
           class="gridster-item-resizable-handler handle-w"></div>
      <div triDrag #se
           (triDragStarted)="onDragStarted($event)"
           (triDragMoved)="onDragSeMoved($event)"
           (triDragEnded)="onDragEnded($event)"
           class="gridster-item-resizable-handler handle-se"></div>
      <div triDrag #ne
           (triDragStarted)="onDragStarted($event)"
           (triDragMoved)="onDragNeMoved($event)"
           (triDragEnded)="onDragEnded($event)"
           class="gridster-item-resizable-handler handle-ne"></div>
      <div triDrag #sw
           (triDragStarted)="onDragStarted($event)"
           (triDragMoved)="onDragSwMoved($event)"
           (triDragEnded)="onDragEnded($event)"
           class="gridster-item-resizable-handler handle-sw"></div>
      <div triDrag #nw
           (triDragStarted)="onDragStarted($event)"
           (triDragMoved)="onDragNwMoved($event)"
           (triDragEnded)="onDragEnded($event)"
           class="gridster-item-resizable-handler handle-nw"></div>
    </div>
  `,
  providers      : [
    {
      provide: TRI_DROP_CONTAINER, useValue: null
    }
  ],
  host           : {
    'class'                           : 'tri-drag-resize-container',
    '[class.tri-drag-resize-resizing]': 'resizing',
    '[style.inset.px]'                : '-outMargin/2',
  },
  styleUrls      : [`../../style/drag-resize.css`]
})
export class TriDragResizeContainer {
  x: number = 0;
  y: number = 0;

  x2: number = 0;
  y2: number = 0;

  resizing: boolean = false;

  @ViewChild('content', {read: ElementRef, static: false})
  contentElementRef: ElementRef<HTMLElement>;

  @ViewChild('placeholder', {read: ElementRef, static: false})
  placeholderElementRef: ElementRef<HTMLElement>;

  @ViewChild('n', {read: TriDrag, static: false})
  northDrag: TriDrag;

  @ViewChild('s', {read: TriDrag, static: false})
  southDrag: TriDrag;

  @ViewChild('e', {read: TriDrag, static: false})
  eastDrag: TriDrag;

  @ViewChild('w', {read: TriDrag, static: false})
  westDrag: TriDrag;

  @ViewChild('se', {read: TriDrag, static: false})
  southEastDrag: TriDrag;

  @ViewChild('ne', {read: TriDrag, static: false})
  northEastDrag: TriDrag;

  @ViewChild('sw', {read: TriDrag, static: false})
  southWestDrag: TriDrag;

  @ViewChild('nw', {read: TriDrag, static: false})
  northWestDrag: TriDrag;

  @Input()
  disabled: boolean = true;

  @Input()
  width: number = 0;

  @Input()
  height: number = 0;

  @Input()
  outMargin: number = 0;

  @Output('triDragResizeStarted')
  resizeStarted: EventEmitter<TriDragResizeStart> = new EventEmitter();

  @Output('triDragResized')
  resized: EventEmitter<TriDragResize> = new EventEmitter();

  @Output('triDragResizeEnded')
  resizeEnded: EventEmitter<TriDragResizeEnd> = new EventEmitter();

  constructor(private _cdRef: ChangeDetectorRef) {

  }

  getContentElement() {
    return this.contentElementRef.nativeElement;
  }

  getPlaceHolderElement() {
    return this.placeholderElementRef.nativeElement;
  }

  _setDragPosition(drag: TriDrag, pointer: Point) {
    if (drag && drag._dragRef && !drag._dragRef.isDragging()) {
      drag._dragRef.setFreeDragPosition(pointer);
    }

    if (ngDevMode && !drag) {
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

    if (this.northDrag) {
      this.northDrag._dragRef.getRootElement().style.width = `${this.x2 - this.x}px`;
    }

    if (this.eastDrag) {
      this.eastDrag._dragRef.getRootElement().style.height = `${this.y2 - this.y}px`;
    }

    if (this.southDrag) {
      this.southDrag._dragRef.getRootElement().style.width = `${this.x2 - this.x}px`;
    }

    if (this.westDrag) {
      this.westDrag._dragRef.getRootElement().style.height = `${this.y2 - this.y}px`;
    }

    this._setDragPosition(this.northDrag, {x: this.x, y: this.y});
    this._setDragPosition(this.eastDrag, {x: this.x2, y: this.y});
    this._setDragPosition(this.southDrag, {x: this.x, y: this.y2});
    this._setDragPosition(this.westDrag, {x: this.x, y: this.y});

    this._setDragPosition(this.northWestDrag, {x: this.x, y: this.y});
    this._setDragPosition(this.northEastDrag, {x: this.x2, y: this.y});
    this._setDragPosition(this.southWestDrag, {x: this.x, y: this.y2});
    this._setDragPosition(this.southEastDrag, {x: this.x2, y: this.y2});

    if (this.contentElementRef) {
      this.contentElementRef.nativeElement.style.transform = `translate(${this.x}px, ${this.y}px)`;
      this.contentElementRef.nativeElement.style.width     = `${this.x2 - this.x}px`;
      this.contentElementRef.nativeElement.style.height    = `${this.y2 - this.y}px`;
    }

    if (this.placeholderElementRef) {
      this.placeholderElementRef.nativeElement.style.transform = `translate(${this.x}px, ${this.y}px)`;
      this.placeholderElementRef.nativeElement.style.width     = `${this.x2 - this.x}px`;
      this.placeholderElementRef.nativeElement.style.height    = `${this.y2 - this.y}px`;
    }

    // this.northDrag?._dragRef.setFreeDragPosition({x: this.x, y: this.y});
    // this.eastDrag?._dragRef.setFreeDragPosition({x: this.x + this._calculatedWidth, y: this.y});
    // this.southDrag?._dragRef.setFreeDragPosition({x: this.x, y: this.y + this._calculatedHeight});
    // this.westDrag?._dragRef.setFreeDragPosition({x: this.x, y: this.y});

    // // this.northWestDrag?._dragRef.setFreeDragPosition({x: this.x, y: this.y});
    // this.northEastDrag?._dragRef.setFreeDragPosition({x: this.x + this._calculatedWidth, y: this.y});
    // // this.southWestDrag?._dragRef.setFreeDragPosition({x: this.x, y: this.y + this._calculatedHeight});
    // this.southEastDrag?._dragRef.setFreeDragPosition({x: this.x + this._calculatedWidth, y: this.y + this._calculatedHeight});
  }

  onDragStarted(event: TriDragStart) {
    this.resizing = true;
    this.resizeStarted.emit({
      source: this, dragEvent: event
    });
  }

  onDragResize(event: TriDragMove, from: string) {
    this.resized.emit({
      source: this, dragEvent: event,
      x     : this.x, y: this.y,
      x2    : this.x2, y2: this.y2,
      width : this.x2 - this.x,
      height: this.y2 - this.y
    });
  }

  onDragEnded(event: TriDragEnd) {
    this.resizing = false;
    this.resizeEnded.emit({
      source: this, dragEvent: event,
      x     : this.x, y: this.y,
      x2    : this.x2, y2: this.y2,
      width : this.x2 - this.x,
      height: this.y2 - this.y
    });
  }

  onDragSMoved(event: TriDragMove) {

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.y2            = dragPosition.y;
    this._setItemsPosition();
    this.onDragResize(event, 's');
  }

  onDragNMoved(event: TriDragMove) {

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.y             = dragPosition.y;
    this._setItemsPosition();
    this.onDragResize(event, 'n');
  }

  onDragWMoved(event: TriDragMove) {

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.x             = dragPosition.x;
    this._setItemsPosition();
    this.onDragResize(event, 'w');
  }

  onDragEMoved(event: TriDragMove) {

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.x2            = dragPosition.x;
    this._setItemsPosition();
    this.onDragResize(event, 'e');
  }

  onDragSwMoved(event: TriDragMove) {

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.x             = dragPosition.x;
    this.y2            = dragPosition.y;
    this._setItemsPosition();
    this.onDragResize(event, 'sw');
  }

  onDragNwMoved(event: TriDragMove) {

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.x             = dragPosition.x;
    this.y             = dragPosition.y;
    this._setItemsPosition();
    this.onDragResize(event, 'nw');
  }

  onDragSeMoved(event: TriDragMove) {

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.x2            = dragPosition.x;
    this.y2            = dragPosition.y;
    this._setItemsPosition();
    this.onDragResize(event, 'se');
  }

  onDragNeMoved(event: TriDragMove) {

    const dragPosition = event.source._dragRef.getFreeDragPosition();
    this.y             = dragPosition.y;
    this.x2            = dragPosition.x;
    this._setItemsPosition();
    this.onDragResize(event, 'ne');
  }

  recalculateXy() {
    this.x2 = this.x + this.width + this.outMargin;
    this.y2 = this.y + this.height + this.outMargin;
  }

  reset() {
    this.x  = 0;
    this.y  = 0;
    this.x2 = this.x + this.width;
    this.y2 = this.y + this.height;
    this._setItemsPosition();
    this._cdRef.detectChanges();
  }

  ngOnInit() {
    this.recalculateXy();

    this._runSetItemsPosition$.pipe(
      debounceTime(10),
      tap(() => {
        this._runSetItemsPosition();
      })
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['height'] && !changes['height'].firstChange ||
      changes['width'] && !changes['width'].firstChange ||
      changes['outMargin'] && !changes['outMargin'].firstChange ||
      changes['disabled']) {
      this.recalculateXy();
      this._setItemsPosition();
    }
    if (changes['outMargin'] || changes['disabled']) {
      this._cdRef.detectChanges();
    }
  }

  ngAfterViewInit() {
    this._setItemsPosition();
    this._cdRef.detach();
  }
}
