import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triFormItem], [tri-form-item]'
})
export class FormItemDirective {
  _withHelp = 0;

  @HostBinding(`class.tri-form-item`)
  _nzFormItem = true;

  enableHelp() {
    this._withHelp++;
  }

  disableHelp() {
    this._withHelp--;
  }

  @HostBinding(`class.tri-form-item-with-help`)
  get withHelp(): boolean {
    return this._withHelp > 0;
  }

  constructor() {}
}
