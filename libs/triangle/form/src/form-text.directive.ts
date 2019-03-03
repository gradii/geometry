import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triFormText], [tri-form-text]'
})
export class FormTextDirective {
  @HostBinding(`class.tri-form-text`)
  _nzFormText = true;
}
