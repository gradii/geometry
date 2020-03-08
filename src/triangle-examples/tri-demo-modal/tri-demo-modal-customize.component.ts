/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title modal-customize
 */
@Component({
  selector: 'tri-demo-modal-customize',
  template: `
              <button tri-button [type]="'primary'" (click)="showModal()">
                <span>显示对话框</span>
              </button>
              <tri-modal
                [visible]="isVisible"
                [title]="modalTitle"
                [content]="modalContent"
                [footer]="modalFooter"
                (onCancel)="handleCancel($event)">
                <ng-template #modalTitle>
                  对话框标题
                </ng-template>
                <ng-template #modalContent>
                  <p>对话框的内容</p>
                  <p>对话框的内容</p>
                  <p>对话框的内容</p>
                  <p>对话框的内容</p>
                  <p>对话框的内容</p>
                </ng-template>
                <ng-template #modalFooter>
                  <button tri-button [type]="'default'" [size]="'large'" (click)="handleCancel($event)">
                    返 回
                  </button>
                  <button tri-button [type]="'primary'" [size]="'large'" (click)="handleOk($event)" [loading]="isConfirmLoading">
                    提 交
                  </button>
                </ng-template>
              </tri-modal>
            `,
  styles: []
})
export class TriDemoModalCustomizeComponent {
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
