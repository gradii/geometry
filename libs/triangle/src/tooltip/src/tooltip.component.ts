import {
  Component,
  ViewEncapsulation,
  Input,
  TemplateRef,
  Output,
  Renderer2,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef,
  ContentChild,
  ViewChild
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { TooltipDirective } from './tooltip.directive';
import { AnimationEvent } from '@angular/animations';
import { FadeAnimation } from '@gradii/triangle/core';
import { POSITION_MAP, DEFAULT_4_POSITIONS } from '@gradii/triangle/core';
import { OverlayOrigin, ConnectionPositionPair, ConnectedOverlayDirective } from '@angular/cdk/overlay';

@Component({
  selector: 'tri-tooltip',
  encapsulation: ViewEncapsulation.None,
  animations: [FadeAnimation],
  template: `
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
      <div class="ant-tooltip" [ngClass]="_classMap" [ngStyle]="overlayStyle" [@fadeAnimation]="''+(visible$ | async)"
           (@fadeAnimation.done)="_afterVisibilityAnimation($event)">
        <div class="ant-tooltip-content">
          <div class="ant-tooltip-arrow"></div>
          <div class="ant-tooltip-inner">
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
  @ContentChild(TooltipDirective) origin;

  /**
   * #Template
   */
  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  /**
   * #overlay
   */
  @ViewChild('overlay') overlay: ConnectedOverlayDirective;

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

  /**
   * Get visible
   * 获取手动控制浮层显隐
   */
  get visible() {
    return this.visibleSource.value;
  }

  visibleSource = new BehaviorSubject<boolean>(false);
  visible$ = this.visibleSource.asObservable();

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

  /**
   * Get trigger
   * 获取触发行为
   */
  get trigger() {
    return this._trigger;
  }

  _prefix = 'ant-tooltip-placement';
  _positions: ConnectionPositionPair[] = [...DEFAULT_4_POSITIONS];
  _classMap = {};
  _placement = 'top';
  _trigger = 'hover';
  _hasBackdrop = false;

  /**
   * Get the positon of tooltip, optional: `top` `left` `right` `bottom` `topLeft` `topRight`<br />
   * `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom`
   * 获取气泡框位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight`<br />
   * `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom`
   */
  @Input()
  get placement() {
    return this._placement;
  }

  /**
   * Set the positon of tooltip, optional: `top` `left` `right` `bottom` `topLeft` `topRight`<br />
   * `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom`
   * 设置气泡框位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight`<br />
   * `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom`
   * @param value
   */
  set placement(value) {
    if (value !== this._placement) {
      this._placement = value;
      this._positions.unshift(POSITION_MAP[this.placement] as ConnectionPositionPair);
    }
  }

  // Manually force updating current overlay's position
  updatePosition() {
    if (this.overlay && this.overlay.overlayRef) {
      this.overlay.overlayRef.updatePosition();
    }
  }

  onPositionChange($event) {
    for (const key in POSITION_MAP) {
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
      [this.overlayClassName]: true,
      [`ant-tooltip-placement-${this._placement}`]: true
    };
  }

  constructor(private _renderer: Renderer2, private _cdr: ChangeDetectorRef) {}

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
