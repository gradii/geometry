/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { MessageService } from '@gradii/triangle/message';

/**
 * @title message-loading
 */
@Component({
  selector: 'tri-demo-message-loading',
  template: `
    <button tri-button [type]="'default'" (click)="createBasicMessage()">显示加载中</button>
`,
  styles: []
})
export class TriDemoMessageLoadingComponent implements OnInit {
  _id;
  createBasicMessage = () => {
    this._id = this._message.loading('正在执行中', { duration: 0 }).messageId;
    setTimeout(_ => {
      this._message.remove(this._id);
    }, 2500);
  };

  constructor(private _message: MessageService) {}

  ngOnInit() {}
}
