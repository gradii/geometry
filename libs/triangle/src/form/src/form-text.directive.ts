import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triFormText], [tri-form-text]'
})
export class FormTextDirective {
  @HostBinding(`class.ant-form-text`)
  _nzFormText = true;
}
