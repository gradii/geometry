/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[triTextarea]',
  exportAs: 'triTextarea',
  host    : {
    '[style.resize]': 'resize',
    '[class.error]' : 'error'
  }
})
export class TextareaDirective {
  @Input() resize: 'none' | 'vertical' | 'horizontal' | 'both' | 'inherit' = 'none';
  @Input() error: boolean;

  constructor() {
  }

}
