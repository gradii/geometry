/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Host, Inject, Input, Optional, ViewEncapsulation } from '@angular/core';
import { FormComponent } from './form.component';

@Component({
  selector: 'tri-form-item',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>`,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../style/form-item.css'],
  host     : {
    'class'                           : 'tri-form-item',
    '[class.tri-form-item-vertical]'  : 'layout === "vertical"',
    '[class.tri-form-item-horizontal]': 'layout === "horizontal"',
    '[class.tri-form-item-inline]'    : 'layout === "inline"',
    '[class.tri-form-item-with-help]' : 'withHelp'
  },
})
export class FormItemComponent {

  _layout: 'vertical' | 'horizontal';

  @Input()
  get layout(): 'vertical' | 'horizontal' {
    if (!this._layout && this.form) {
      return this.form.layout;
    }
    return this._layout;
  }

  set layout(value: 'vertical' | 'horizontal') {
    this._layout = value;
  }

  constructor(@Optional() @Host() @Inject(FormComponent)
              private form: FormComponent | undefined) {
  }

  _withHelp = 0;

  get withHelp(): boolean {
    return this._withHelp > 0;
  }

  enableHelp() {
    this._withHelp++;
  }

  disableHelp() {
    this._withHelp--;
  }
}
