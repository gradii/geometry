/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ChangeDetectorRef, Directive, Input } from '@angular/core';

@Directive({
  selector: '[triInput], [tri-input]',
  host    : {
    'autocomplete'           : 'off',
    'class'                       : 'tri-input',
    '[class.tri-input-lg]'        : '_size === "large"',
    '[class.tri-input-sm]'        : '_size === "small"',
    '[class.tri-input-disabled]'  : '_disabled',
    '[disabled]'             : '_disabled',
    '[readonly]'             : '_readonly',
    '[class.tri-input-full-width]': 'fullWidth'
  }
})
export class InputDirective {

  @Input()
  fullWidth: boolean;

  _size = 'default';

  @Input()
  get size(): string {
    return this._size;
  }

  set size(value: string) {
    this._size = value;
  }

  _readonly = false;

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = value;
  }

  _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  constructor() {
  }
}
