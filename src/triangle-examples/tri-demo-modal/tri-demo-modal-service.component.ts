/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { ModalService } from '@gradii/triangle/modal';
import { TriDemoModalDataOutsideComponent } from './tri-demo-modal-data-outside.component';

/**
 * @title modal-service
 */
@Component({
  selector: 'tri-demo-modal-service',
  template: `
    <button tri-button [type]="'primary'" (click)="showModal()">
      <span>使用文本</span>
    </button>
    <button tri-button [type]="'primary'" (click)="showModalForTemplate(title, content, footer)">
      <span>使用模板</span>
    </button>
    <ng-template #title>
      <span>对话框标题模板</span>
    </ng-template>
    <ng-template #content>
      <div>
        <p>对话框的内容</p>
        <p>对话框的内容</p>
        <p>对话框的内容</p>
        <p>对话框的内容</p>
        <p>对话框的内容</p>
      </div>
    </ng-template>
    <ng-template #footer>
      <div>
        <button tri-button [type]="'primary'" [size]="'large'" (click)="handleOk($event)" [loading]="isConfirmLoading">
          提 交
        </button>
      </div>
    </ng-template>
    <button tri-button [type]="'primary'" (click)="showModalForComponent()">
      <span>使用Component</span>
    </button>
  `
})
export class TriDemoModalServiceComponent {
  currentModal;
  isConfirmLoading = false;

  constructor(private modalService: ModalService) {}

  showModal() {
    const modal = this.modalService.open({
      title: '对话框标题',
      content: '纯文本内容，点确认 1 秒后关闭',
      closable: false,
      onOk() {
        return new Promise(resolve => {
          setTimeout(resolve, 1000);
        });
      },
      onCancel() {}
    });
  }

  showModalForTemplate(titleTpl, contentTpl, footerTpl) {
    this.currentModal = this.modalService.open({
      title: titleTpl,
      content: contentTpl,
      footer: footerTpl,
      maskClosable: false,
      onOk() {
        console.log('Click ok');
      }
    });
  }

  showModalForComponent() {
    const subscription = this.modalService.open({
      title: '对话框标题',
      content: TriDemoModalDataOutsideComponent,
      onOk() {},
      onCancel() {
        console.log('Click cancel');
      },
      footer: false,
      componentParams: {
        name: '测试渲染Component'
      }
    });
    subscription.subscribe(result => {
      console.log(result);
    });
  }

  handleOk(e) {
    this.isConfirmLoading = true;
    setTimeout(() => {
      /* destroy方法可以传入onOk或者onCancel。默认是onCancel */
      this.currentModal.destroy('onOk');
      this.isConfirmLoading = false;
      this.currentModal = null;
    }, 1000);
  }
}
