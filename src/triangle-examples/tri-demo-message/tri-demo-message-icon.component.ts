/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { MessageService } from '@gradii/triangle/message';

/**
 * @title message-icon
 */
@Component({
  selector: 'tri-demo-message-icon',
  template: `
    <button tri-button (click)="createMessage('success','成功')">显示成功提示</button>
    <button tri-button (click)="createMessage('error','报错')">显示报错提示</button>
    <button tri-button (click)="createMessage('warning','警告')">显示警告提示</button>
`,
  styles: []
})
export class TriDemoMessageIconComponent implements OnInit {
  createMessage = (type, text) => {
    this._message.create(type, `这是一条${text}提示`);
  };
  constructor(private _message: MessageService) {}

  ngOnInit() {}
}
