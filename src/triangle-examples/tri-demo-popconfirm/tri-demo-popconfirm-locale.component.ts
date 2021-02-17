/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { MessageService } from '@gradii/triangle/message';

/**
 * @title popconfirm-locale
 */
@Component({
  selector: 'tri-demo-popconfirm-locale',
  template: `
              <tri-popconfirm
                [title]="'Are you sure？'"
                [okText]="'ok'"
                [cancelText]="'cancel'"
                (onConfirm)="confirm()"
                (onCancel)="cancel()">
                <a tri-popconfirm>delete</a>
              </tri-popconfirm>
            `
})
export class TriDemoPopconfirmLocalComponent implements OnInit {
  constructor(private message: MessageService) {}

  ngOnInit() {}

  cancel() {
    this.message.info('click cancel');
  }

  confirm() {
    this.message.info('click confirm');
  }
}
