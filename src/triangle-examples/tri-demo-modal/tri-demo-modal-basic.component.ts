/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title modal-basic
 */
@Component({
  selector: 'tri-demo-modal-basic',
  template: `
              <button tri-button [type]="'primary'" (click)="showModal()">
                <span>显示对话框</span>
              </button>
              <tri-modal
                [visible]="isVisible"
                [title]="'第一个 Modal'"
                [content]="modalContent"
                (onCancel)="handleCancel($event)"
                (onOk)="handleOk($event)">
                <ng-template #modalContent>
                  <p>对话框的内容</p>
                  <p>对话框的内容</p>
                  <p>对话框的内容</p>
                </ng-template>
              </tri-modal>
            `,
  styles: []
})
export class TriDemoModalBasicComponent {
  isVisible = false;

  showModal = () => {
    this.isVisible = true;
  };

  handleOk = e => {
    console.log('点击了确定');
    this.isVisible = false;
  };

  handleCancel = e => {
    console.log(e);
    this.isVisible = false;
  };

  constructor() {}
}
