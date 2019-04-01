import { Directive, Host, Input } from '@angular/core';
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

  protected _fixedLabel;

  @Input()
  set fixedLabel(value) {
    this._fixedLabel = value;
  }

  get fixedLabel() {
    if (this._fixedLabel) {
      return this._fixedLabel;
    }
    return this.form.fixedLabel;
  }

  constructor(@Host() private form: FormDirective) {

  }
}
