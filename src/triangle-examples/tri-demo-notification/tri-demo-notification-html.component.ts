/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { TriNotificationService } from '@gradii/triangle/message';

/**
 * @title notification-html
 */
@Component({
  selector: 'tri-demo-notification-html',
  template: `
    <button tri-button [type]="'primary'" (click)="createBasicNotification()">打开通知提示框</button>
`,
  styles: []
})
export class TriDemoNotificationHtmlComponent implements OnInit {
  createBasicNotification = () => {
    this._notification.html('<strong>自定义通知栏内HTML</strong><br><p>HTML</p>');
  };
  constructor(private _notification: TriNotificationService) {}

  ngOnInit() {}
}
