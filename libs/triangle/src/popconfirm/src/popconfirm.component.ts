import { FadeAnimation } from '@gradii/triangle/core';
import { ToolTipComponent } from '@gradii/triangle/tooltip';
import { Component, ContentChild, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { PopConfirmDirective } from './popconfirm.directive';

@Component({
  selector     : 'tri-popconfirm',
  encapsulation: ViewEncapsulation.None,
  animations   : [FadeAnimation],
  template     : `
    <ng-content></ng-content>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayHasBackdrop]="_hasBackdrop"
      (backdropClick)="hide()"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="visible$ | async">
      <div class="ant-popover" [ngClass]="_classMap" [ngStyle]="overlayStyle" [@fadeAnimation]="''+(visible$ | async)"
           (@fadeAnimation.done)="_afterVisibilityAnimation($event)">
        <div class="ant-popover-content">
          <div class="ant-popover-arrow"></div>
          <div class="ant-popover-inner">
            <div>
              <div class="ant-popover-inner-content">
                <div class="ant-popover-message" *ngIf="!template">
                  <i class="anticon anticon-exclamation-circle"></i>
                  <div class="ant-popover-message-title">{{title}}</div>
                </div>
                <div class="ant-popover-buttons" *ngIf="!template">
                  <button triButton [size]="'small'" (click)="onCancel()"><span>{{cancelText}}</span></button>
                  <button triButton [size]="'small'" [type]="'primary'" (click)="onConfirm()">
                    <span>{{okText}}</span></button>
                </div>
                <ng-template
                  *ngIf="template"
                  [ngTemplateOutlet]="template">
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>`
})
export class PopConfirmComponent extends ToolTipComponent {
  _prefix = 'ant-popover-placement';
  _trigger = 'click';
  _hasBackdrop = true;
  _condition = false;

  /**
   * Content
   * 内容
   */
  @Input() content;

  /**
   * The text for confirm button
   * 确认按钮文字
   * @default {string} 确定
   */
  @Input() okText = '确定';

  /**
   * The text for cancel button
   * @default {string} 取消
   */
  @Input() cancelText = '取消';

  /**
   * Set whether directly exec confirm
   * 设置是否直接执行确定方法
   * @param value
   */
  @Input()
  set condition(value) {
    this._condition = value;
  }

  /**
   * Get whether directly exec confirm
   */
  get condition() {
    return this._condition;
  }

  /**
   * The event of on cancel
   */
  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  /**
   * The event of on confirm
   */
  @Output() onConfirm: EventEmitter<any> = new EventEmitter();

  /**
   * `NzPopConfirmDirective` directive
   * `NzPopConfirmDirective` 指令
   */
  @ContentChild(PopConfirmDirective) origin;

  show(): void {
    if (!this._condition) {
      this.visible = true;
    } else {
      this._onConfirm();
    }
  }

  _onCancel() {
    this.onCancel.emit();
    this.visible = false;
  }

  _onConfirm() {
    this.onConfirm.emit();
    this.visible = false;
  }
}
