import { Component, ContentChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { RadioTileDirective } from './radio-tile.directive';

export interface RadioOption {
  value: string;
  label: string | TemplateRef<any>;
  checked?: boolean;
  disabled?: boolean;
}

@Component({
  selector     : '[tri-radio]',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <span [class.ant-radio]="true"
          [class.ant-radio-checked]="_checked"
          [class.ant-radio-focused]="_focused"
          [class.ant-radio-disabled]="_disabled">
      <span class="ant-radio-inner"></span>
      <input type="radio"
             class="ant-radio-input"
             [(ngModel)]="checked"
             (focus)="focus()"
             (blur)="blur()">
    </span>
    <ng-content></ng-content>
    <ng-template
      [ngIf]="labelTemplate"
      [ngTemplateOutlet]="labelTemplate"></ng-template>
    <span *ngIf="!labelTemplate&&!!label">{{label}}</span>
  `,
  host         : {
    '[class.ant-radio-wrapper]': 'true'
  }
})
export class RadioComponent extends RadioTileDirective implements RadioOption {
  @ContentChild(TemplateRef) labelTemplate;

  focus() {
    this._focused = true;
  }

  blur() {
    this._focused = false;
    this.radioGroup.onTouched();
  }
}
