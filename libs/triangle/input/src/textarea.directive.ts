/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BooleanInput, coerceBooleanProperty, NumberInput } from '@angular/cdk/coercion';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'textarea[triTextarea], textarea[tri-textarea]',
  exportAs: 'triTextarea',
  host    : {
    'attr.autocomplete'           : 'off',
    'class'                       : 'tri-input',
    '[class.tri-input-lg]'        : '_size === "large"',
    '[class.tri-input-sm]'        : '_size === "small"',
    '[class.tri-input-disabled]'  : '_disabled',
    '[disabled]'                  : '_disabled',
    '[readonly]'                  : '_readonly',
    '[class.tri-input-full-width]': 'fullWidth',
    '[style.resize]'              : 'resize',
  }
})
export class TextareaDirective {
  @Input() resize: 'none' | 'vertical' | 'horizontal' | 'both' | 'inherit' = 'none';

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

  @Input()
  fullWidth: boolean;

  constructor() {
  }

}


@Directive({
  selector: 'textarea[tri-autosize], textarea[triTextareaAutosize]',
  exportAs: 'triTextareaAutosize',
  inputs  : ['cdkAutosizeMinRows', 'cdkAutosizeMaxRows', 'enabled:triAutoSize'],
  host    : {
    'class': 'cdk-textarea-autosize tri-autosize',
    // Textarea elements that have the directive applied should have a single row by default.
    // Browsers normally show two rows by default and therefore this limits the minRows binding.
    'rows': '1',
  },
})
export class TextareaAutosize extends CdkTextareaAutosize {
  @Input()
  get triAutosizeMinRows(): number {
    return this.minRows;
  }

  set triAutosizeMinRows(value: number) {
    this.minRows = value;
  }

  @Input()
  get triAutosizeMaxRows(): number {
    return this.maxRows;
  }

  set triAutosizeMaxRows(value: number) {
    this.maxRows = value;
  }

  @Input('tri-autosize')
  get triAutosize(): boolean {
    return this.enabled;
  }

  set triAutosize(value: boolean) {
    this.enabled = value;
  }

  @Input()
  get triTextareaAutosize(): boolean {
    return this.enabled;
  }

  set triTextareaAutosize(value: boolean) {
    this.enabled = coerceBooleanProperty(value);
  }

  static ngAcceptInputType_minRows: NumberInput;
  static ngAcceptInputType_maxRows: NumberInput;
  static ngAcceptInputType_triAutosize: BooleanInput;
  static ngAcceptInputType_triTextareaAutosize: BooleanInput;
}
