/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { MessageService } from '@gradii/triangle/message';

/**
 * @title popconfirm-basic
 */
@Component({
  selector: 'tri-demo-popconfirm-basic',
  template: `
              <tri-popconfirm [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()">
                <a tri-popconfirm>删除</a>
              </tri-popconfirm>
            `
})
export class TriDemoPopconfirmBasicComponent implements OnInit {
  constructor(private message: MessageService) {}

  ngOnInit() {}

  cancel() {
    this.message.info('click cancel');
  }

  confirm() {
    this.message.info('click confirm');
  }
}
