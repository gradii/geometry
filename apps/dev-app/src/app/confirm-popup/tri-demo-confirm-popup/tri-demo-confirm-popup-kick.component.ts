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
 * @title confirm-popup-kick
 */
@Component({
  selector: 'tri-demo-confirm-popup-kick',
  template: `
              <!-- <tri-confirm-popup [title]="'确定要删除这个任务吗？'" [condition]="switchValue" (onConfirm)="confirm()" (onCancel)="cancel()"> -->
                <a triConfirmPopup="确定要删除这个任务吗？"
                   (onConfirm)="confirm()" (onCancel)="cancel()"
                >删除某任务</a>
              <!-- </tri-confirm-popup> -->
              <br>
              <br>
              点击是否直接执行
              <tri-switch
               ngDefaultControl
               [(ngModel)]="switchValue"></tri-switch>
            `
})
export class TriDemoConfirmPopupKickComponent implements OnInit {
  switchValue = false;

  cancel() {
    this.message.info('click cancel');
  }

  confirm() {
    this.message.info('click confirm');
  }

  constructor(private message: TriMessageService) {
  }

  ngOnInit() {
  }
}
