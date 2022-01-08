/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, Input, Optional, Self } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

@Directive({
  selector: '[triInput], [tri-input]',
  host    : {
    'autocomplete'                : 'off',
    'class'                       : 'tri-input',
    '[class.tri-input-outlined]'  : 'variant === "outlined"',
    '[class.tri-input-lg]'        : '_size === "large"',
    '[class.tri-input-sm]'        : '_size === "small"',
    '[class.tri-input-disabled]'  : '_disabled',
    '[disabled]'                  : 'disabled',
    '[readonly]'                  : '_readonly',
    '[required]'                  : 'required',
    '[attr.aria-required]'        : 'required',
    '[class.tri-input-full-width]': '_fullWidth'
  }
})
export class InputDirective {
  private _fullWidth: boolean;

  @Input()
  get fullWidth(): boolean {
    return this._fullWidth;
  }

  set fullWidth(value: boolean) {
    this._fullWidth = coerceBooleanProperty(value);
  }

  _size = 'default';

  @Input()
  get size(): string {
    return this._size;
  }

  set size(value: string) {
    this._size = value;
  }

  protected _required: boolean | undefined;

  @Input()
  get required(): boolean {
    return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }

  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }

  protected _readonly = false;

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
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  @Input()
  variant: 'outlined' | 'filled' | 'default' = 'outlined';

  constructor(@Optional() @Self() public ngControl: NgControl) {
  }

  static ngAcceptInputType_fullWidth: BooleanInput;
}
