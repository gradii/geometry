/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title modal-async
 */
@Component({
  selector: 'tri-demo-modal-async',
  template: `
              <button tri-button [type]="'primary'" (click)="showModal()">
                <span>显示对话框</span>
              </button>
              <tri-modal
                [visible]="isVisible"
                [title]="'对话框标题'"
                [content]="modalContent"
                (onCancel)="handleCancel($event)"
                (onOk)="handleOk($event)"
                [confirmLoading]="isConfirmLoading">
                <ng-template #modalContent>
                  <p>对话框的内容</p>
                </ng-template>
              </tri-modal>
            `,
  styles: []
})
export class TriDemoModalAsyncComponent {
  isVisible = false;
  isConfirmLoading = false;

  showModal = () => {
    this.isVisible = true;
  };

  handleOk = e => {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  };

  handleCancel = e => {
    this.isVisible = false;
  };

  constructor() {}
}
