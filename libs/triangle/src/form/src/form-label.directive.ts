import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triFormLabel], [tri-form-label]'
})
export class FormLabelDirective {
  @HostBinding(`class.ant-form-item-label`)
  _nzFormItemLabel = true;
}
