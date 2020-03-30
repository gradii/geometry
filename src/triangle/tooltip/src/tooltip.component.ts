/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AnimationEvent } from '@angular/animations';
import { CdkConnectedOverlay, ConnectionPositionPair } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DEFAULT_4_POSITIONS, FadeAnimation, POSITION_MAP } from '@gradii/triangle/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TooltipDirective } from './tooltip.directive';

@Component({
  selector     : 'tri-tooltip',
  encapsulation: ViewEncapsulation.None,
  animations   : [FadeAnimation],
  template     : `
    <ng-content></ng-content>
    <ng-template
      #overlay="cdkConnectedOverlay"
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayHasBackdrop]="_hasBackdrop"
      (backdropClick)="hide()"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="visible$ | async">
      <div class="tri-tooltip" [ngClass]="_classMap" [ngStyle]="overlayStyle"
           [@fadeAnimation]="''+(visible$ | async)"
           (@fadeAnimation.done)="_afterVisibilityAnimation($event)">
        <div class="tri-tooltip-content">
          <div class="tri-tooltip-arrow"></div>
          <div class="tri-tooltip-inner">
            <span *ngIf="!tooltipTemplate">{{title}}</span>
            <ng-template
              *ngIf="tooltipTemplate"
              [ngTemplateOutlet]="tooltipTemplate">
            </ng-template>
          </div>
        </div>
      </div>
    </ng-template>`
})
export class ToolTipComponent implements AfterViewInit {
  /**
   * The title.
   * 标题
   */
  @Input() title: string;

  /**
   * The class name of the overlay
   * 卡片类名
   */
  @Input() overlayClassName = '';

  /**
   * The overlay style
   * 悬浮层样式
   */
  @Input() overlayStyle = {};

  /**
   * the event of visible change
   */
  @Output() visibleChange: EventEmitter<any> = new EventEmitter();

  /**
   * `TooltipDirective`
   */
  @ContentChild(TooltipDirective, {static: false}) origin: TooltipDirective;

  /**
   * #Template
   */
  @ContentChild('tooltipTemplate', {static: false}) tooltipTemplate: TemplateRef<any>;

  /**
   * #overlay
   */
  @ViewChild('overlay', {static: false}) overlay: CdkConnectedOverlay;
  visibleSource = new BehaviorSubject<boolean>(false);
  visible$: Observable<boolean> = this.visibleSource.asObservable();
  _prefix = 'tri-tooltip-placement';
  _positions: ConnectionPositionPair[] = [...DEFAULT_4_POSITIONS];
  _classMap = {};
  _hasBackdrop = false;

  constructor(private _renderer: Renderer2, private _cdr: ChangeDetectorRef) {
  }

  /**
   * Get visible
   * 获取手动控制浮层显隐
   */
  get visible() {
    return this.visibleSource.value;
  }

  /**
   * Set to manual control overlay display and hidden. two way binding
   * 用于手动控制浮层显隐 双向绑定
   * @param value
   */
  @Input()
  set visible(value) {
    if (this.visibleSource.value !== value) {
      this.visibleSource.next(value);
      this.visibleChange.emit(value);
    }
  }

  _placement: any = 'top';

  /**
   * Get the positon of tooltip, optional:
   * `top` `left` `right` `bottom`
   * `topLeft` `topRight` `bottomLeft` `bottomRight`
   * `leftTop` `leftBottom` `rightTop` `rightBottom`
   * 获取气泡框位置，可选
   * `top` `left` `right` `bottom`
   * `topLeft` `topRight` `bottomLeft` `bottomRight`
   * `leftTop` `leftBottom` `rightTop` `rightBottom`
   */
  @Input()
  get placement() {
    return this._placement;
  }

  /**
   * Set the positon of tooltip, optional:
   * `top` `left` `right` `bottom`
   * `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom`
   * 设置气泡框位置，可选
   * `top` `left` `right` `bottom`
   * `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom`
   * @param value
   */
  set placement(value) {
    if (value !== this._placement) {
      this._placement = value;
      // @ts-ignore
      this._positions.unshift(POSITION_MAP[this.placement] as ConnectionPositionPair);
    }
  }

  _trigger = 'hover';

  /**
   * Get trigger
   * 获取触发行为
   */
  get trigger() {
    return this._trigger;
  }

  /**
   * Set trigger
   * 设置触发行为，可选  `hover/focus/click`
   * @param value
   */
  @Input()
  set trigger(value) {
    this._trigger = value;
    this._hasBackdrop = this._trigger === 'click';
  }

  // Manually force updating current overlay's position
  updatePosition(): void {
    if (this.overlay && this.overlay.overlayRef) {
      this.overlay.overlayRef.updatePosition();
    }
  }

  onPositionChange($event: any): void {
    for (const key in POSITION_MAP) {
      // @ts-ignore
      if (JSON.stringify($event.connectionPair) === JSON.stringify(POSITION_MAP[key])) {
        this.placement = key;
        break;
      }
    }
    this.setClassMap();
    /** TODO may cause performance problem */
    this._cdr.detectChanges();
  }

  show(): void {
    this.visible = true;
    this.origin.isTooltipOpen = true;
  }

  hide(): void {
    this.visible = false;
    this.origin.isTooltipOpen = false;
  }

  _afterVisibilityAnimation(e: AnimationEvent): void {
    if (e.toState === 'false' && !this.visible) {
      this.visibleChange.emit(false);
    }
    if (e.toState === 'true' && this.visible) {
      this.visibleChange.emit(true);
    }
  }

  setClassMap() {
    this._classMap = {
      [this.overlayClassName]                     : true,
      [`tri-tooltip-placement-${this._placement}`]: true
    };
  }

  ngAfterViewInit() {
    if (this._trigger === 'hover') {
      this._renderer.listen(this.origin.elementRef.nativeElement, 'mouseenter', () => this.show());
      this._renderer.listen(this.origin.elementRef.nativeElement, 'mouseleave', () => this.hide());
    } else if (this._trigger === 'focus') {
      this._renderer.listen(this.origin.elementRef.nativeElement, 'focus', () => this.show());
      this._renderer.listen(this.origin.elementRef.nativeElement, 'blur', () => this.hide());
    } else if (this._trigger === 'click') {
      this._renderer.listen(this.origin.elementRef.nativeElement, 'click', e => {
        e.preventDefault();
        this.show();
      });
    }
  }
}
