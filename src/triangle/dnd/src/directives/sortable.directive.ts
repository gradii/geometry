/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[triSortable]'
})
/**
 * Makes an element draggable by adding the draggable html attribute
 */
export class SortableDirective {
  @HostBinding('attr.dsortable')
  @Input('dSortable') dSortDirection = 'v';
  @HostBinding('attr.d-sortable-zmode')
  @Input() dSortableZMode = false;
  @HostBinding('attr.d-sortable') dSortable = true;

  constructor(public el: ElementRef) {
  }
}
