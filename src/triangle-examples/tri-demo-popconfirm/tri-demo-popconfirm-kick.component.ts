/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { MessageService } from '@gradii/triangle/message';

/**
 * @title popconfirm-kick
 */
@Component({
  selector: 'tri-demo-popconfirm-kick',
  template: `
              <tri-popconfirm [title]="'确定要删除这个任务吗？'" [condition]="switchValue" (onConfirm)="confirm()" (onCancel)="cancel()">
                <a tri-popconfirm>删除某任务</a>
              </tri-popconfirm>
              <br>
              <br>
              点击是否直接执行
              <tri-switch [(ngModel)]="switchValue"></tri-switch>
            `
})
export class TriDemoPopconfirmKickComponent implements OnInit {
  switchValue = false;

  cancel() {
    this.message.info('click cancel');
  }

  confirm() {
    this.message.info('click confirm');
  }

  constructor(private message: MessageService) {}

  ngOnInit() {}
}
