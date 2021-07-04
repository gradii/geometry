/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Host, Input, Optional } from '@angular/core';
import { FormDirective } from './form.directive';

@Directive({
  selector: 'tri-form-label, [triFormLabel], [tri-form-label]',
  host    : {
    '[class.tri-form-item-label]': 'true',
    '[style.width.px]'           : 'fixedLabel',
    '[style.flex]'               : 'fixedLabel?"0 0 "+fixedLabel+"px":null'
  }
})
export class FormLabelDirective {

  constructor(@Optional() @Host() private form: FormDirective) {
  }

  protected _fixedLabel: number;

  get fixedLabel() {
    if (this._fixedLabel) {
      return this._fixedLabel;
    } else if (this.form) {
      return this.form.fixedLabel;
    }

    return undefined;
  }

  @Input()
  set fixedLabel(value) {
    this._fixedLabel = value;
  }
}
