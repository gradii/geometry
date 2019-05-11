import { Component } from '@angular/core';
import { ModalService } from '@gradii/triangle/modal';

/**
 * @title confirm-async
 */
@Component({
  selector: 'tri-demo-confirm-async',
  template: `
    <button tri-button [type]="'info'" (click)="showConfirm()">
      <span>确认对话框</span>
    </button>
  `,
  styles: []
})
export class TriDemoConfirmAsyncComponent {
  showConfirm = () => {
    this.confirmServ.confirm({
      title: '您是否确认要删除这项内容',
      content: '点确认 1 秒后关闭',
      onOk() {
        return new Promise(resolve => {
          setTimeout(resolve, 1000);
        });
      },
      onCancel() {}
    });
  };

  constructor(private confirmServ: ModalService) {}
}
