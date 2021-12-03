/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';
import { TriMessageService } from '@gradii/triangle/message';

/**
 * @title confirm-popup-basic
 */
@Component({
  selector: 'tri-demo-confirm-popup-basic',
  template: `<a triConfirmPopup="确定要删除这个任务吗？"
                (onConfirm)="confirm()"
                (onCancel)="cancel()"
            >删除</a>
            `
})
export class TriDemoConfirmPopupBasicComponent implements OnInit {
  constructor(private message: TriMessageService) {
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
