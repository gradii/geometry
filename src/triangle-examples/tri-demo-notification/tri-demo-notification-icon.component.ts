/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@gradii/triangle/message';

/**
 * @title notification-icon
 */
@Component({
  selector: 'tri-demo-notification-icon',
  template: `
    <button tri-button (click)="createNotification('success')">成 功</button>
    <button tri-button (click)="createNotification('info')">消 息</button>
    <button tri-button (click)="createNotification('warning')">警 告</button>
    <button tri-button (click)="createNotification('error')">错 误</button>
`,
  styles: []
})
export class TriDemoNotificationIconComponent implements OnInit {
  createNotification = type => {
    this._notification.create(type, '这是标题', '这是提示框的文案这是提示框示框的文案这是提示是提示框的文案这是提示框的文案');
  };
  constructor(private _notification: NotificationService) {}

  ngOnInit() {}
}
