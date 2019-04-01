import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'tri-form-extra, [triFormExtra], [tri-form-extra]',
  host: {
    '[class.tri-form-extra]': 'true'
  }
})
export class FormExtraDirective {
}
