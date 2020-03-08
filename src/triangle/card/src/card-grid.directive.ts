/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triCardGrid], [tri-card-grid]'
})
export class CardGridDirective {
  @HostBinding('class.tri-card-grid') _CardGrid = true;
}
