/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';
import { MessageService } from '@gradii/triangle/message';

/**
 * @title confirm-popup-location
 */
@Component({
  selector: 'tri-demo-confirm-popup-location',
  template: `
    <div style="margin-left: 60px">
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'topLeft'">
        <button triConfirmPopup triButton class="ant-btn">上左</button>
      </tri-confirm-popup>
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'top'">
        <button triConfirmPopup triButton class="ant-btn">上边</button>
      </tri-confirm-popup>
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'topRight'">
        <button triConfirmPopup triButton class="ant-btn">上右</button>
      </tri-confirm-popup>
    </div>
    <div style="width: 60px; float: left;">
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'leftTop'">
        <button triConfirmPopup triButton class="ant-btn">左上</button>
      </tri-confirm-popup>
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'left'">
        <button triConfirmPopup triButton class="ant-btn">左边</button>
      </tri-confirm-popup>
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'leftBottom'">
        <button triConfirmPopup triButton class="ant-btn">左下</button>
      </tri-confirm-popup>
    </div>
    <div style="width: 60px; margin-left: 252px;">
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'rightTop'">
        <button triConfirmPopup
                triButton
                class="ant-btn">右上
        </button>
      </tri-confirm-popup>
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'right'">
        <button triConfirmPopup
                triButton
                class="ant-btn">右边
        </button>
      </tri-confirm-popup>
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'rightBottom'">
        <button triConfirmPopup
                triButton
                class="ant-btn">右下
        </button>
      </tri-confirm-popup>
    </div>
    <div style="margin-left: 60px; clear: both;">
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'bottomLeft'">
        <button triConfirmPopup
                triButton
                class="ant-btn">下左
        </button>
      </tri-confirm-popup>
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'bottom'">
        <button triConfirmPopup
                triButton
                class="ant-btn">下边
        </button>
      </tri-confirm-popup>
      <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()"
                         [placement]="'bottomRight'">
        <button triConfirmPopup
                triButton
                class="ant-btn">下右
        </button>
      </tri-confirm-popup>
    </div>
  `,
  styles  : [
    `
      .tri-popover-wrap > a {
        margin-right : 1em;
      }

      .tri-btn {
        margin-right  : 1em;
        margin-bottom : 1em;
      }
    `
  ]
})
export class TriDemoConfirmPopupLocationComponent implements OnInit {
  constructor(private message: MessageService) {
  }

  ngOnInit() {
  }

  cancel() {
    this.message.info('click cancel');
  }

  confirm() {
    this.message.info('click confirm');
  }
}
