/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { TriNotificationService } from '@gradii/triangle/message';

/**
 * @title notification-basic
 */
@Component({
  selector: 'tri-demo-notification-basic',
  template: `
    <button tri-button [type]="'primary'" (click)="createBasicNotification()">打开通知提示框</button>
  `,
  styles: []
})
export class TriDemoNotificationBasicComponent implements OnInit {
  constructor(private _notification: TriNotificationService) {}

  ngOnInit() {}

  createBasicNotification() {
    this._notification.blank('这是标题', '这是提示框的文案这是提示框的文案这是提示框的文案这是提示框的文案这是提示框的文案这是提示框的文案这是提示框的文案');
  }
}
