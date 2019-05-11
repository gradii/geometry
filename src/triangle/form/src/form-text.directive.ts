import { Directive } from '@angular/core';

@Directive({
  selector: 'tri-form-text, [triFormText], [tri-form-text]',
  host    : {
    '[class.tri-form-text]': 'true'
  }
})
export class FormTextDirective {
}
