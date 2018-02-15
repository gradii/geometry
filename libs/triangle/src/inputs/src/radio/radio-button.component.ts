import { Component, ViewEncapsulation } from '@angular/core';

import { RadioComponent } from './radio.component';

@Component({
  selector     : '[tri-radio-button]',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <span [class.ant-radio-button]="true"
          [class.ant-radio-button-checked]="_checked"
          [class.ant-radio-button-focused]="_focused"
          [class.ant-radio-button-disabled]="_disabled">
      <span class="ant-radio-button-inner"></span>
      <input type="radio"
             class="ant-radio-button-input"
             [(ngModel)]="_checked"
             (focus)="focus()"
             (blur)="blur()">
    </span>
    <ng-content></ng-content>
  `,
  host         : {
    '[class.ant-radio-button-wrapper]'         : 'true',
    '[class.ant-radio-button-wrapper-disabled]': 'disabled',
    '[class.ant-radio-button-wrapper-checked]' : 'checked'
  }
})
export class RadioButtonComponent extends RadioComponent {}
