import { Component } from '@angular/core';
import { ModalService } from '@gradii/triangle/modal';

/**
 * @title confirm-info
 */
@Component({
  selector: 'tri-demo-confirm-info',
  template: `
    <button tri-button [type]="'info'" (click)="info(contentTpl)">
      <span>信息提示</span>
    </button>
    <ng-template #contentTpl>
      <div>
        <p>一些附加信息一些附加信息一些附加信息</p>
        <p>一些附加信息一些附加信息一些附加信息</p>
      </div>
    </ng-template>
    <button tri-button [type]="'info'" (click)="success()">
      <span>成功提示</span>
    </button>
    <button tri-button [type]="'info'" (click)="error()">
      <span>失败提示</span>
    </button>
    <button tri-button [type]="'info'" (click)="warning()">
      <span>警告提示</span>
    </button>
  `,
  styles: []
})
export class TriDemoConfirmInfoComponent {
  info(contentTpl) {
    this.confirmServ.info({
      title: '这是一条通知信息',
      content: contentTpl
    });
  }

  success() {
    this.confirmServ.success({
      title: '这是一条成功信息',
      content: '一些附加信息一些附加信息一些附加信息'
    });
  }

  error() {
    this.confirmServ.error({
      title: '这是一条失败信息',
      content: '一些附加信息一些附加信息一些附加信息'
    });
  }

  warning() {
    this.confirmServ.warning({
      title: '这是一条警告信息',
      content: '一些附加信息一些附加信息一些附加信息'
    });
  }

  constructor(private confirmServ: ModalService) {}
}
