/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[triFormItemRequired], [tri-form-item-required]'
})
export class FormItemRequiredDirective {
  @Input()
  @HostBinding(`class.tri-form-item-required`)
  required = true;
}
