/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Inject, OnDestroy, OnInit, Optional, Self, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TRI_DROP_CONTAINER } from '../directives/drop-container';
import { TriDropGridContainer } from '../directives/drop-grid-container';
import { TriResize } from '../directives/resize';
import { AnchorPosition, OffsetPoint, ResizeRef } from '../drag-drop-ref/resize-ref';
import { getMutableClientRect } from '../utils/client-rect';
import { TriDragGridItemComponent } from './drag-grid-item.component';
import { GridPushResizeService } from './grid-push-resize.service';
import { GridPushService } from './grid-push.service';


interface ResizingEvent {
  source: ResizeRef;
  pointerPosition: { x: number, y: number };
  event: MouseEvent | TouchEvent;
  distance: OffsetPoint;
  delta: { x: -1 | 0 | 1, y: -1 | 0 | 1 };
  resizeAnchorPosition: AnchorPosition;
}

@Directive({
  selector: 'tri-drag-grid-item[triResize]'
})
export class GridResizeableDirective implements OnInit, OnDestroy {

  push: GridPushService;
  pushResize: GridPushResizeService;

  itemBackup: number[] = [];

  initPosition = {
    x    : 0, y: 0,
    width: 0, height: 0
  };

  _initialClientRect: ClientRect;
  cachedRenderPosition: {
    // initialClientRect: ClientRect,
    x: number, y: number,
    renderX: number, renderY: number,
    renderWidth: number, renderHeight: number
  };

  destroy$ = new Subject();

  constructor(
    @Inject(TRI_DROP_CONTAINER) @SkipSelf() public dropContainer: TriDropGridContainer,
    @Optional() @Self() private item: TriDragGridItemComponent,
    @Optional() @Self() private resize: TriResize,
  ) {

    if (item && resize) {
      console.log('inited');

      // this.push       = new GridPushService(this.item);
      // this.pushResize = new GridPushResizeService(this.item);
    }
  }

  _setItemTop(top: number): void {
    this.item.element.nativeElement.style.top = `${top}px`;
  }

  _setItemLeft(left: number): void {
    this.item.element.nativeElement.style.left = `${left}px`;
  }

  _setItemHeight(height: number): void {
    this.item.element.nativeElement.style.height = `${height}px`;
  }

  _setItemWidth(width: number): void {
    this.item.element.nativeElement.style.width = `${width}px`;
  }

  newPosition: number;
  minHeight: number;
  minWidth: number;

  private handleNorth = (evt: ResizingEvent): void => {
    const {offsetX, offsetY, offsetX2, offsetY2} = evt.distance;


    let y      = this.cachedRenderPosition.y + offsetY;
    let height = this.cachedRenderPosition.renderHeight - offsetY;
    if (this.minHeight > height) {
      height = this.minHeight;
      y      = this.cachedRenderPosition.y + this.cachedRenderPosition.renderHeight - this.minHeight;
    }
    this.newPosition = this.dropContainer.pixelsToPositionY(
      y - (this.dropContainer.rowGap /*+ snapGap*/),
      Math.floor);

    if (this.item.renderY !== this.newPosition) {
      this.itemBackup[1] = this.item.renderY;
      this.itemBackup[3] = this.item.renderRows;
      this.item.renderRows +=
        this.item.renderY - this.newPosition;
      this.item.renderY  = this.newPosition;
      // this.pushResize.pushItems(this.pushResize.fromSouth);
      // this.push.pushItems(
      //   this.push.fromSouth,
      //   this.gridster.$options.disablePushOnResize
      // );

      const previewRect     = {
        x    : this.cachedRenderPosition.x, y,
        width: this.cachedRenderPosition.renderWidth, height
      };
      const placeholderRect = {
        x     : this.cachedRenderPosition.x,
        y     : this.dropContainer.positionYToPixels(this.item.renderY),
        width : this.cachedRenderPosition.renderWidth,
        height: this.item.renderRows * this.dropContainer.renderTileHeight
      };

      if (this.dropContainer.checkCollision(this.item)) {
        this.item.renderY    = this.itemBackup[1];
        this.item.renderRows = this.itemBackup[3];

        placeholderRect.y      = previewRect.y = this.dropContainer.positionYToPixels(
          this.item.renderY);
        placeholderRect.height = previewRect.height = this.item.renderRows * this.dropContainer.renderTileHeight;

      } else {
        this.item.renderY    = this.itemBackup[1];
        this.item.renderRows = this.itemBackup[3];
      }

      this.resize._resizeRef._previewRef?.applyTransform(
        previewRect.x - this.cachedRenderPosition.x + this._initialClientRect.left,
        previewRect.y - this.cachedRenderPosition.y + this._initialClientRect.top,
      );

      this.resize._resizeRef._previewRef?.applySize(
        previewRect.width, previewRect.height
      );

      this.resize._resizeRef.getPlaceholderElement().style.transform = `translate(${placeholderRect.x}px, ${placeholderRect.y}px)`;

      this.resize._resizeRef.getPlaceholderElement().style.width  = `${placeholderRect.width}px`;
      this.resize._resizeRef.getPlaceholderElement().style.height = `${placeholderRect.height}px`;

      // this.pushResize.checkPushBack();
      // this.push.checkPushBack();
    }
    // this._setItemTop(top);
    // this._setItemHeight(height);
  };

  // private handleWest = (e: ResizingEvent): void => {
  //   const clientX =
  //           /*this.gridster.$options.dirType === DirTypes.RTL
  //             ? this.originalClientX + (this.originalClientX - e.clientX)
  //             : */e.clientX;
  //   this.left     = clientX + this.offsetLeft - this.diffLeft;
  //
  //   this.width = this.right - this.left;
  //   if (this.minWidth > this.width) {
  //     this.width = this.minWidth;
  //     this.left  = this.right - this.minWidth;
  //   }
  //   this.newPosition = this.gridster.pixelsToPositionX(
  //     this.left + this.margin,
  //     Math.floor
  //   );
  //   if (this.item.renderX !== this.newPosition) {
  //     this.itemBackup[0] = this.item.renderX;
  //     this.itemBackup[2] = this.item.renderCols;
  //     this.item.renderCols +=
  //       this.item.renderX - this.newPosition;
  //     this.item.renderX  = this.newPosition;
  //     this.pushResize.pushItems(this.pushResize.fromEast);
  //     this.push.pushItems(
  //       this.push.fromEast,
  //       this.gridster.$options.disablePushOnResize
  //     );
  //     if (this.gridster.checkCollision(this.item)) {
  //       this.item.renderX    = this.itemBackup[0];
  //       this.item.renderCols = this.itemBackup[2];
  //       this._setItemLeft(
  //         this.gridster.positionXToPixels(this.item.renderX)
  //       );
  //       this._setItemWidth(
  //         this.gridster.positionXToPixels(this.item.renderCols) -
  //         this.margin
  //       );
  //       return;
  //     } else {
  //       this.gridster.previewStyle();
  //     }
  //     this.pushResize.checkPushBack();
  //     this.push.checkPushBack();
  //   }
  //   this._setItemLeft(this.left);
  //   this._setItemWidth(this.width);
  // };
  //
  // private handleSouth = (e: ResizingEvent): void => {
  //   this.height = e.clientY + this.offsetTop - this.diffBottom - this.top;
  //   if (this.minHeight > this.height) {
  //     this.height = this.minHeight;
  //   }
  //   this.bottom      = this.top + this.height;
  //   this.newPosition = this.gridster.pixelsToPositionY(this.bottom, Math.ceil);
  //   if (
  //     this.item.renderY + this.item.renderRows !==
  //     this.newPosition
  //   ) {
  //     this.itemBackup[3]   = this.item.renderRows;
  //     this.item.renderRows =
  //       this.newPosition - this.item.renderY;
  //     this.pushResize.pushItems(this.pushResize.fromNorth);
  //     this.push.pushItems(
  //       this.push.fromNorth,
  //       this.gridster.$options.disablePushOnResize
  //     );
  //     if (this.gridster.checkCollision(this.item)) {
  //       this.item.renderRows = this.itemBackup[3];
  //       this._setItemHeight(
  //         this.gridster.positionYToPixels(this.item.renderRows) -
  //         this.margin
  //       );
  //       return;
  //     } else {
  //       this.gridster.previewStyle();
  //     }
  //     this.pushResize.checkPushBack();
  //     this.push.checkPushBack();
  //   }
  //   this._setItemHeight(this.height);
  // };
  //
  // private handleEast = (e: ResizingEvent): void => {
  //   const clientX =
  //           /*this.gridster.$options.dirType === DirTypes.RTL
  //             ? this.originalClientX + (this.originalClientX - e.clientX)
  //             :*/ e.clientX;
  //   this.width    = clientX + this.offsetLeft - this.diffRight - this.left;
  //
  //   if (this.minWidth > this.width) {
  //     this.width = this.minWidth;
  //   }
  //   this.right       = this.left + this.width;
  //   this.newPosition = this.gridster.pixelsToPositionX(this.right, Math.ceil);
  //   if (
  //     this.item.renderX + this.item.renderCols !==
  //     this.newPosition
  //   ) {
  //     this.itemBackup[2]   = this.item.renderCols;
  //     this.item.renderCols =
  //       this.newPosition - this.item.renderX;
  //     this.pushResize.pushItems(this.item._dragRef, this.pushResize.fromWest);
  //     this.push.pushItems(
  //       this.item._dragRef,
  //       this.push.fromWest,
  //       this.gridster.$options.disablePushOnResize
  //     );
  //     if (this.gridster.checkCollision(this.item)) {
  //       this.item.renderCols = this.itemBackup[2];
  //       this._setItemWidth(
  //         this.gridster.positionXToPixels(this.item.renderCols) -
  //         this.margin
  //       );
  //       return;
  //     } else {
  //       this.gridster.previewStyle();
  //     }
  //     this.pushResize.checkPushBack();
  //     this.push.checkPushBack();
  //   }
  //   this._setItemWidth(this.width);
  // };
  //
  // private handleNorthWest = (e: ResizingEvent): void => {
  //   this.handleNorth(e);
  //   this.handleWest(e);
  // };
  //
  // private handleNorthEast = (e: ResizingEvent): void => {
  //   this.handleNorth(e);
  //   this.handleEast(e);
  // };
  //
  // private handleSouthWest = (e: ResizingEvent): void => {
  //   this.handleSouth(e);
  //   this.handleWest(e);
  // };
  //
  // private handleSouthEast = (e: ResizingEvent): void => {
  //   this.handleSouth(e);
  //   this.handleEast(e);
  // };

  ngOnInit() {
    this.resize._resizeRef.beforeStarted.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this._initialClientRect = getMutableClientRect(this.item.element.nativeElement);
    });
    this.resize._resizeRef.started.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {

      // const rect                = getMutableClientRect(this.item.element.nativeElement);
      this.cachedRenderPosition = {
        // initialClientRect: rect,
        x           : this.item.left,
        y           : this.item.top,
        renderX     : this.item.renderX,
        renderY     : this.item.renderY,
        renderWidth : this.item.renderWidth,
        renderHeight: this.item.renderHeight
      };

      this.minHeight = this.item.minItemRows * this.dropContainer.renderTileHeight - this.dropContainer.rowGap;
      this.minWidth  = this.item.minItemCols * this.dropContainer.renderTileWidth - this.dropContainer.columnGap;
    });

    this.resize._resizeRef.resizing.pipe(
      takeUntil(this.destroy$)
    ).subscribe((evt: ResizingEvent) => {

      const {offsetX, offsetY, offsetX2, offsetY2} = evt.distance;

      // const snapGap = 5;
      const anchorPosition = evt.resizeAnchorPosition;

      if (anchorPosition === 'north') {
        this.handleNorth(evt);
      }
      // else if (anchorPosition === 'south') {
      //   this.handleSouth(evt);
      // } else if (anchorPosition === 'west') {
      //   this.handleWest(evt);
      // } else if (anchorPosition === 'east') {
      //   this.handleEast(evt);
      // } else if (anchorPosition === 'westNorth') {
      //   this.handleNorthWest(evt);
      // } else if (anchorPosition === 'westSouth') {
      //   this.handleSouthWest(evt);
      // } else if (anchorPosition === 'eastNorth') {
      //   this.handleNorthEast(evt);
      // } else if (anchorPosition === 'eastSouth') {
      //   this.handleSouthEast(evt);
      // }

      // if (anchorPosition === 'north') {
      //   this.item.renderY = this.dropContainer.pixelsToPositionY(
      //     this.item.top + offsetY - (this.dropContainer.rowGap /*+ snapGap*/), Math.floor);
      // } else if (anchorPosition === 'south') {
      //   this.item.renderRows = Math.ceil(
      //     (this.item.renderHeight + offsetY2 + this.dropContainer.rowGap /*+ snapGap*/) / this.dropContainer.renderTileHeight
      //   );
      //   console.log(this.item.renderRows);
      // } else if (anchorPosition === 'west') {
      //   this.item.renderX = this.dropContainer.pixelsToPositionX(
      //     this.item.left + offsetX - (this.dropContainer.columnGap /*+ snapGap*/), Math.floor);
      // } else if (anchorPosition === 'east') {
      //   this.item.renderCols = Math.ceil(
      //     (this.item.renderWidth + offsetX2 + (this.dropContainer.columnGap /*+ snapGap*/)) / this.dropContainer.renderTileWidth
      //   );
      // }
      //
      // const c = this.dropContainer.checkCollision(this.item);
      // console.log('collisioned', c);
      // if (c) {
      //   if (anchorPosition === 'north') {
      //     offsetY = c.top + c.renderHeight + this.dropContainer.rowGap - this.item.top;
      //   } else if (anchorPosition === 'south') {
      //     offsetY2 = c.top - this.dropContainer.rowGap - (this.item.top + this.item.renderHeight);
      //   } else if (anchorPosition === 'west') {
      //     offsetX = c.left + c.renderWidth + this.dropContainer.columnGap - this.item.left;
      //   } else if (anchorPosition === 'east') {
      //     offsetX2 = c.left - this.dropContainer.columnGap - (this.item.left + this.item.renderWidth);
      //   }
      // }
      //
      //
      // this.resize._resizeRef._previewRef.applyTransform(
      //   // @ts-ignore
      //   this.resize._resizeRef._initialClientRect.left + offsetX,
      //   // @ts-ignore
      //   this.resize._resizeRef._initialClientRect.top + offsetY
      // );
      // this.resize._resizeRef._previewRef?.applySize(
      //   // @ts-ignore
      //   this.resize._resizeRef._initialClientRect.width + offsetX2 - offsetX,
      //   // @ts-ignore
      //   this.resize._resizeRef._initialClientRect.height + offsetY2 - offsetY
      // );

    });
  }

  ngOnDestroy() {
    this.destroy$.complete();
  }
}
