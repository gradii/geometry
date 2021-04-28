/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';
import { MessageService } from '@gradii/triangle/message';

/**
 * @title message-basic
 */
@Component({
  selector: 'tri-demo-message-basic',
  template: `
    <button tri-button [type]="'primary'" (click)="createBasicMessage()">显示普通提醒</button>
`,
  styles  : []
})
export class TriDemoMessageBasicComponent implements OnInit {
  constructor(private _message: MessageService) {
  }

  ngOnInit() {
  }

  createBasicMessage() {
    this._message.info('这是一条普通的提醒');
  }
}
