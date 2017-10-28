import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[triFormItemRequired], [tri-form-item-required]'
})
export class FormItemRequiredDirective {
  @Input()
  @HostBinding(`class.ant-form-item-required`)
  nzRequired = true;
}
