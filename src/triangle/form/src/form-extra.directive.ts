/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive } from '@angular/core';

@Directive({
  selector: 'tri-form-extra, [triFormExtra], [tri-form-extra]',
  host    : {
    '[class.tri-form-extra]': 'true'
  }
})
export class FormExtraDirective {
}
