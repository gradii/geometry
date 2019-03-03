import { Component, ViewEncapsulation } from '@angular/core';

import { RadioComponent } from './radio.component';

@Component({
  moduleId           : module.id,
  selector           : '[tri-radio-button]',
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false,
  template           : `
    <span [class.tri-radio-button]="true"
          [class.tri-radio-button-checked]="_checked"
          [class.tri-radio-button-focused]="_focused"
          [class.tri-radio-button-disabled]="_disabled">
      <span class="ant-radio-button-inner"></span>
      <input type="radio"
             class="ant-radio-button-input"
             [(ngModel)]="_checked"
             (focus)="focus()"
             (blur)="blur()">
    </span>
    <ng-content></ng-content>
  `,
  host               : {
    '[class.tri-radio-button-wrapper]'         : 'true',
    '[class.tri-radio-button-wrapper-disabled]': 'disabled',
    '[class.tri-radio-button-wrapper-checked]' : 'checked'
  }
})
export class RadioButtonComponent extends RadioComponent {}
