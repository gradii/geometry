import { Directive } from '@angular/core';

@Directive({
  selector: 'tri-form-split, [triFormSplit], [tri-form-split]',
  host    : {
    '[class.tri-form-split]': 'true'
  }
})
export class FormSplitDirective {
}
