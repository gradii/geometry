/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { ModalService } from '@gradii/triangle/modal';

/**
 * @title modal-locale
 */
@Component({
  selector: 'tri-demo-modal-locale',
  template: `
              <button tri-button [type]="'primary'" (click)="showModal()">
                <span>Show Modal</span>
              </button>
              <tri-modal
                [visible]="isVisible"
                [title]="'Modal'"
                [content]="modalContent"
                (onCancel)="handleCancel($event)"
                (onOk)="handleOk($event)">
                <ng-template #modalContent>
                  <p>Bla bla ...</p>
                  <p>Bla bla ...</p>
                  <p>Bla bla ...</p>
                </ng-template>
              </tri-modal>
              <br/>
              <button tri-button [type]="'info'" (click)="showConfirm()">
                <span>confirm</span>
              </button>
            `,
  styles: []
})
export class TriDemoModalLocaleComponent {
  isVisible = false;

  showModal = () => {
    this.isVisible = true;
  };

  handleOk = e => {
    this.isVisible = false;
  };

  handleCancel = e => {
    console.log(e);
    this.isVisible = false;
  };

  showConfirm = () => {
    this.confirmServ.confirm({
      title: 'Confirm',
      content: 'Bla bla ...',
      okText: 'OK',
      cancelText: 'Cancel'
    });
  };

  constructor(private confirmServ: ModalService) {}
}
