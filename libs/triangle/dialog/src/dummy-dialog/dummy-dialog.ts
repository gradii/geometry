import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'tri-dummy-dialog',
  template: `
    <ng-template [ngIf]="!titleTemplate">
      <div tri-dialog-close></div>
    </ng-template>
    <ng-template [ngTemplateOutlet]="titleTemplate"></ng-template>
    <div tri-dialog-header>
      <div>title</div>
    </div>
    <div tri-dialog-content>
      <p>
        hello foo
      </p>
    </div>
    <div tri-dialog-actions>
      <button tri-button>取消</button>
      <button tri-button color="primary">提交</button>
    </div>
  `
})
export class DummyDialog {

  @Input() title;
  @ContentChild('dialog-close-template', {read: TemplateRef})
  titleTemplate: TemplateRef<any>;

  @Input() content;
  @ContentChild('dialog-content-template', {read: TemplateRef})
  contentTemplate: TemplateRef<any>;

  @Input() footer;
  @ContentChild('dialog-actions-template', {read: TemplateRef})
  actionsTemplate: TemplateRef<any>;

  @Input() cancelDisabled: boolean = false;
  @Input() okDisabled: boolean = false;

  constructor() {
  }
}