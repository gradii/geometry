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
      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="topLeft"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">上左
      </button>

      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="top"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">上边
      </button>

      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="topRight"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">上右
      </button>
    </div>
    <div style="width: 60px; float: left;">
      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="leftTop"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">左上
      </button>

      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="left"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">左边
      </button>

      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="leftBottom"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">左下
      </button>
    </div>
    <div style="width: 60px; margin-left: 252px;">
      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="rightTop"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">右上
      </button>

      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="right"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">右边
      </button>

      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="rightBottom"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">右下
      </button>
    </div>
    <div style="margin-left: 60px; clear: both;">
      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="bottomLeft"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">下左
      </button>

      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="bottom"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">下边
      </button>

      <button triConfirmPopup="确定要删除这个任务吗？"
              triConfirmPopupPosition="bottomRight"
              triButton
              (onConfirm)="confirm()"
              (onCancel)="cancel()"
              class="ant-btn">下右
      </button>
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
