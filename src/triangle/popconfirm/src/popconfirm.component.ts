import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { FadeAnimation } from '@gradii/triangle/core';
import { ToolTipComponent } from '@gradii/triangle/tooltip';
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
          <div class="tri-popover" [ngClass]="_classMap" [ngStyle]="overlayStyle"
               [@fadeAnimation]="''+(visible$ | async)"
               (@fadeAnimation.done)="_afterVisibilityAnimation($event)">
              <div class="tri-popover-content">
                  <div class="tri-popover-arrow"></div>
                  <div class="tri-popover-inner">
                      <div>
                          <div class="tri-popover-inner-content">
                              <div class="tri-popover-message" *ngIf="!popoverTemplate">
                                  <i class="anticon anticon-exclamation-circle"></i>
                                  <div class="tri-popover-message-title">{{title}}</div>
                              </div>
                              <div class="tri-popover-buttons" *ngIf="!popoverTemplate">
                                  <button tri-button [size]="'small'" (click)="_onCancel()">
                                      <span>{{cancelText}}</span></button>
                                  <button tri-button [size]="'small'" [color]="'primary'"
                                          (click)="_onConfirm()">
                                      <span>{{okText}}</span></button>
                              </div>
                              <ng-template
                                      *ngIf="popoverTemplate"
                                      [ngTemplateOutlet]="popoverTemplate">
                              </ng-template>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </ng-template>`
})
export class PopConfirmComponent extends ToolTipComponent {
  _prefix = 'tri-popover-placement';
  _trigger = 'click';
  _hasBackdrop = true;
  @ContentChild('popoverTemplate', {static: false}) popoverTemplate: TemplateRef<any>;
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
  @ContentChild(PopConfirmDirective, {static: false}) origin;

  _condition = false;

  /**
   * Get whether directly exec confirm
   */
  get condition() {
    return this._condition;
  }

  /**
   * Set whether directly exec confirm
   * 设置是否直接执行确定方法
   * @param value
   */
  @Input()
  set condition(value) {
    this._condition = value;
  }

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
