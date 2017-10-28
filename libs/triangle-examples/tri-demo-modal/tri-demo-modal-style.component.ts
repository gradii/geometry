import { Component } from '@angular/core';

/**
 * @title modal-style
 */
@Component({
  selector: 'tri-demo-modal-style',
  template: `
              <button tri-button [type]="'primary'" (click)="showModalTop()">
                <span>显示距离顶部 20px 的对话框</span>
              </button>
              <button tri-button [type]="'primary'" (click)="showModalMiddle()">
                <span>显示垂直居中的对话框</span>
              </button>
              <tri-modal
                [style]="style"
                [visible]="isVisibleTop"
                [content]="modalContent1"
                [title]="'距离顶部 20px 的对话框'"
                (onCancel)="handleCancelTop($event)"
                (onOk)="handleOkTop($event)">
                <ng-template #modalContent1>
                  <p>对话框的内容</p>
                  <p>对话框的内容</p>
                  <p>对话框的内容</p>
                </ng-template>
              </tri-modal>
              <tri-modal
                [wrapClassName]="'vertical-center-modal'"
                [content]="modalContent2"
                [visible]="isVisibleMiddle"
                [title]="'垂直居中的对话框'"
                (onCancel)="handleCancelMiddle($event)"
                (onOk)="handleOkMiddle($event)">
                <ng-template #modalContent2>
                  <p>对话框的内容</p>
                  <p>对话框的内容</p>
                  <p>对话框的内容</p>
                </ng-template>
              </tri-modal>
            `,
  styles: [
    `
    :host ::ng-deep .vertical-center-modal {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host ::ng-deep .vertical-center-modal .ant-modal {
      top: 0;
    }
  `
  ]
})
export class TriDemoModalStyleComponent {
  isVisibleTop = false;
  isVisibleMiddle = false;
  style: any = {
    top: '20px'
  };

  showModalTop = () => {
    this.isVisibleTop = true;
  };

  showModalMiddle = () => {
    this.isVisibleMiddle = true;
  };

  handleOkTop = e => {
    console.log('点击了确定');
    this.isVisibleTop = false;
  };

  handleCancelTop = e => {
    console.log(e);
    this.isVisibleTop = false;
  };

  handleOkMiddle = e => {
    console.log('点击了确定');
    this.isVisibleMiddle = false;
  };

  handleCancelMiddle = e => {
    console.log(e);
    this.isVisibleMiddle = false;
  };

  constructor() {}
}
