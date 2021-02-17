/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { ModalService } from '@gradii/triangle/modal';

/**
 * @title confirm-basic
 */
@Component({
  selector: 'tri-demo-confirm-basic',
  template: `
    <button tri-button [type]="'info'" (click)="showConfirm()">
      <span>确认对话框</span>
    </button>
  `,
  styles: []
})
export class TriDemoConfirmBasicComponent {
  showConfirm = () => {
    this.confirmServ.confirm({
      title: '您是否确认要删除这项内容',
      content: '<b>一些解释</b>',
      onOk() {
        console.log('确定');
      },
      onCancel() {}
    });
  };

  constructor(private confirmServ: ModalService) {}
}
