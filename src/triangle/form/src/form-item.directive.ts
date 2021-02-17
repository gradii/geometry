/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'tri-form-item, [triFormItem], [tri-form-item]',
  host    : {
    '[class.tri-form-item]': 'true'
  }
})
export class FormItemDirective {
  constructor() {
  }

  _withHelp = 0;

  @HostBinding(`class.tri-form-item-with-help`)
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
