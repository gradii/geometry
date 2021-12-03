/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { TriNotificationService } from '@gradii/triangle/message';

/**
 * @title notification-duration
 */
@Component({
  selector: 'tri-demo-notification-duration',
  template: `
    <button tri-button [type]="'primary'" (click)="createBasicNotification()">打开通知提示框</button>
`,
  styles: []
})
export class TriDemoNotificationDurationComponent implements OnInit {
  createBasicNotification = () => {
    this._notification.blank('这是标题', '我不会自动关闭，我不会自动关闭，我不会自动关闭，我不会自动关闭，我不会自动关闭，我不会自动关闭，我不会自动关闭', { duration: 0 });
  };
  constructor(private _notification: TriNotificationService) {}

  ngOnInit() {}
}
