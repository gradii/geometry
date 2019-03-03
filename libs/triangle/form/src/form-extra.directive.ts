import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triFormExtra], [tri-form-extra]'
})
export class FormExtraDirective {
  @HostBinding(`class.tri-form-extra`)
  _nzFormExtra = true;
}
