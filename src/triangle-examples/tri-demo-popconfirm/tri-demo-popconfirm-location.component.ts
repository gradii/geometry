/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { MessageService } from '@gradii/triangle/message';

/**
 * @title popconfirm-location
 */
@Component({
  selector: 'tri-demo-popconfirm-location',
  template: `
              <div style="margin-left: 60px">
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'topLeft'">
                  <button tri-popconfirm tri-button class="ant-btn">上左</button>
                </tri-popconfirm>
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'top'">
                  <button tri-popconfirm tri-button class="ant-btn">上边</button>
                </tri-popconfirm>
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'topRight'">
                  <button tri-popconfirm tri-button class="ant-btn">上右</button>
                </tri-popconfirm>
              </div>
              <div style="width: 60px; float: left;">
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'leftTop'">
                  <button tri-popconfirm tri-button class="ant-btn">左上</button>
                </tri-popconfirm>
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'left'">
                  <button tri-popconfirm tri-button class="ant-btn">左边</button>
                </tri-popconfirm>
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'leftBottom'">
                  <button tri-popconfirm tri-button class="ant-btn">左下</button>
                </tri-popconfirm>
              </div>
              <div style="width: 60px; margin-left: 252px;">
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'rightTop'">
                  <button tri-popconfirm tri-button class="ant-btn">右上</button>
                </tri-popconfirm>
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'right'">
                  <button tri-popconfirm tri-button class="ant-btn">右边</button>
                </tri-popconfirm>
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'rightBottom'">
                  <button tri-popconfirm tri-button class="ant-btn">右下</button>
                </tri-popconfirm>
              </div>
              <div style="margin-left: 60px; clear: both;">
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'bottomLeft'">
                  <button tri-popconfirm tri-button class="ant-btn">下左</button>
                </tri-popconfirm>
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'bottom'">
                  <button tri-popconfirm tri-button class="ant-btn">下边</button>
                </tri-popconfirm>
                <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()" [placement]="'bottomRight'">
                  <button tri-popconfirm tri-button class="ant-btn">下右</button>
                </tri-popconfirm>
              </div>
            `,
  styles: [
    `
    .tri-popover-wrap > a {
      margin-right: 1em;
    }

    .tri-btn {
      margin-right: 1em;
      margin-bottom: 1em;
    }
  `
  ]
})
export class TriDemoPopconfirmLocationComponent implements OnInit {
  constructor(private message: MessageService) {}

  ngOnInit() {}

  cancel() {
    this.message.info('click cancel');
  }

  confirm() {
    this.message.info('click confirm');
  }
}
