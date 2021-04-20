/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive } from '@angular/core';

@Directive({
  selector: '[triCardGrid], [tri-card-grid]',
  host    : {
    'class': 'tri-card-grid'
  }
})
export class CardGridDirective {
}
