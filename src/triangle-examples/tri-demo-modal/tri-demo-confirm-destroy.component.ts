/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { ModalService } from '@gradii/triangle/modal';

/**
 * @title confirm-destroy
 */
@Component({
  selector: 'tri-demo-confirm-destroy',
  template: `
    <button tri-button [type]="'info'" (click)="success()">
      <span>成功提示</span>
    </button>
  `,
  styles: []
})
export class TriDemoConfirmDestroyComponent {
  success = () => {
    const modal = this.confirmServ.success({
      title: '这是一条成功信息',
      content: '一秒后自动移除'
    });

    setTimeout(() => modal.destroy(), 1000);
  };

  constructor(private confirmServ: ModalService) {}
}
