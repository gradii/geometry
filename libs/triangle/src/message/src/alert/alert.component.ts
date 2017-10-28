/**
 * @author MoXun
 */
import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FadeAnimation } from '@gradii/triangle/core';

/**
 * todo doc [alert-body] [alert-description]
 */
@Component({
  selector: 'tri-alert',
  encapsulation: ViewEncapsulation.None,
  animations: [FadeAnimation],
  template: `
    <div [ngClass]="_classMap" *ngIf="_display" [@fadeAnimation]>
      <i
        class="ant-alert-icon anticon"
        [class.anticon-cross-circle-o]="type==='error'"
        [class.anticon-check-circle-o]="type==='success'"
        [class.anticon-info-circle-o]="type==='info'"
        [class.anticon-exclamation-circle-o]="type==='warning'"
        *ngIf="showIcon&&description"></i>
      <i
        class="ant-alert-icon anticon"
        [class.anticon-cross-circle]="type==='error'"
        [class.anticon-check-circle]="type==='success'"
        [class.anticon-info-circle]="type==='info'"
        [class.anticon-exclamation-circle]="type==='warning'"
        *ngIf="showIcon&&!description"></i>
      <ng-template [ngIf]="message">
        <span class="ant-alert-message">{{message}}</span>
      </ng-template>
      <ng-template [ngIf]="!message">
        <ng-content select="[alert-body]"></ng-content>
      </ng-template>
      <ng-template [ngIf]="description">
        <span class="ant-alert-description">{{description}}</span>
      </ng-template>
      <ng-template [ngIf]="!description">
        <ng-content select="alert-description"></ng-content>
      </ng-template>
      <ng-template [ngIf]="closeable || closeText">
        <a *ngIf="closeable" (click)="closeAlert($event)" class="ant-alert-close-icon">
          <i class="anticon anticon-cross"></i>
        </a>
        <a *ngIf="closeText" class="ant-alert-close-icon" (click)="closeAlert()">{{closeText}}</a>
      </ng-template>
    </div>
  `
})
export class AlertComponent {
  _display = true;

  /**
   * Required, specify the style of tip, can choose `success`, `info`, `warning`, `error`
   * 必选参数，指定警告提示的样式，有四种选择  `success` 、 `info` 、 `warning` 、 `error`
   */
  @Input() type = 'info';

  /**
   * Whether use top banner
   * 是否用作顶部公告
   */
  @Input() banner = false;

  /**
   * Optional, default not display close button
   * 可选参数，默认不显示关闭按钮
   */
  @Input() closeable = false;

  /**
   * Optional, alert description
   * 可选参数，警告提示的辅助性文字介绍
   */
  @Input() description: string;

  /**
   * Optional, whether display additional icon
   * 可选参数，是否显示辅助图标
   */
  @Input() showIcon = false;

  /**
   * Optional, custom close button
   * 可选参数，自定义关闭按钮
   */
  @Input() closeText: string;

  /**
   * alternative with alert-body, the content for alert
   * 与alert-body标签二选一，警告提示内容
   */
  @Input() message: string;

  /**
   * the event of close
   * 可选参数，关闭时触发的回调函数
   */
  @Output() onClose: EventEmitter<boolean> = new EventEmitter();

  get _classMap() {
    const antAlert = 'ant-alert';
    return {
      [`${antAlert}`]: true,
      [`${antAlert}-${this.type}`]: true,
      [`${antAlert}-no-icon`]: !this.showIcon,
      [`${antAlert}-banner`]: this.banner,
      [`${antAlert}-with-description`]: !!this.description
    };
  }

  closeAlert(): void {
    this._display = false;
    this.onClose.emit(true);
  }

  constructor() {}
}
