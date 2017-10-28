import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triFormSplit], [tri-form-split]'
})
export class FormSplitDirective {
  @HostBinding(`class.ant-form-split`)
  _nzFormSplit = true;
}
