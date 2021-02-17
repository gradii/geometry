/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ChangeDetectorRef, Directive, Input } from '@angular/core';
import { AutoSizeType } from './input.component';

@Directive({
  selector: '[triInput], [tri-input]',
  host    : {
    '[class.tri-input]'         : 'true',
    '[class.tri-input-lg]'      : '_size === "large"',
    '[class.tri-input-sm]'      : '_size === "small"',
    '[class.tri-input-disabled]': '_disabled',
    '[disabled]'                : 'disabled',
    //    '[autosize]': '_autosize',
    '[readonly]'                : '_readonly'
  }
})
export class InputDirective {
  constructor(private _cdRef: ChangeDetectorRef) {
  }

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

  _autosize: boolean | AutoSizeType = false;

  @Input()
  get autosize() {
    return this._autosize;
  }

  set autosize(value: string | boolean | AutoSizeType) {
    if (typeof value === 'string') {
      this._autosize = true;
    } else {
      this._autosize = <boolean | AutoSizeType>value;
    }
  }

  _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  ngOnInit() {
    this._cdRef.detectChanges();
  }
}
