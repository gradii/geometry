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
 * @title confirm-popup-basic
 */
@Component({
  selector: 'tri-demo-confirm-popup-basic',
  template: `
              <tri-confirm-popup [title]="'确定要删除这个任务吗？'" (onConfirm)="confirm()" (onCancel)="cancel()">
                <a tri-confirm-popup>删除</a>
              </tri-confirm-popup>
            `
})
export class TriDemoConfirmPopupBasicComponent implements OnInit {
  constructor(private message: MessageService) {
  }

  ngOnInit() {
  }

  cancel() {
    this.message.info('click cancel');
  }

  confirm() {
    this.message.info('click confirm');
  }
}
