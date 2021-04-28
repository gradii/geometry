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
 * @title confirm-popup-locale
 */
@Component({
  selector: 'tri-demo-confirm-popup-locale',
  template: `
    <!-- <tri-confirm-popup
      [title]="'Are you sure？'"
      [okText]="'ok'"
      [cancelText]="'cancel'"
      (onConfirm)="confirm()"
      (onCancel)="cancel()"> -->
    <a triConfirmPopup="Are you sure？"

       (onConfirm)="confirm()"
       (onCancel)="cancel()"
    >delete</a>
    <!-- </tri-confirm-popup> -->
  `
})
export class TriDemoConfirmPopupLocalComponent implements OnInit {
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
