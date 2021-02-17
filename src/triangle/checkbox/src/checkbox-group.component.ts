/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterContentInit,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  NgZone,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isArray, isFunction } from '@gradii/triangle/util';
import { of } from 'rxjs';
import { merge } from 'rxjs/operators';
import { CheckboxComponent } from './checkbox.component';

@Component({
  selector     : 'tri-checkbox-group',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <tri-checkbox
      [class.tri-checkbox-vertical]="layout=='vertical'"
      *ngFor="let option of _options"
      [disabled]="option.disabled||disabled"
      [label]="option.label"
      [value]="option.value"
      [(ngModel)]="option.checked"
      (ngModelChange)="_optionChange($event)"
    >
    </tri-checkbox>
    <ng-content></ng-content>
  `,
  providers    : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi      : true
    }
  ],
  host         : {
    '[class.tri-checkbox-group]': 'true'
  }
})
export class CheckboxGroupComponent implements AfterContentInit, ControlValueAccessor {
  _el: HTMLElement;
  _totalOptions: Array<any> = [];
  _prefixCls = 'tri-checkbox-group';
  // ngModel Access
  onChange: Function;
  onTouched: any = Function.prototype;
  @Input() disabled = false;
  @Input('type') layout: string;
  @Input()
  checkboxType: 'normal' | 'simple' = 'normal';
  @Input()
  valueMatcher: Function;

  constructor(private _ngZone: NgZone) {
  }

  private _checkboxTiles: QueryList<CheckboxComponent>;

  @ContentChildren(CheckboxComponent)
  set checkboxTiles(value: QueryList<CheckboxComponent>) {
    this._checkboxTiles = value;
    this._buildTotalOptions();
  }

  _options: Array<any> = [];

  @Input()
  set options(value) {
    this._options = value;
    this._buildTotalOptions();
  }

  _buildTotalOptions() {
    if (this._checkboxTiles instanceof QueryList) {
      this._totalOptions = [...this._options, ...this._checkboxTiles.toArray()];
    } else {
      this._totalOptions = [...this._options];
    }
  }

  _optionChange(event?) {
    // this.onChange(this._options);
    if (isFunction(this.onChange)) {
      if (this.checkboxType === 'simple') {
        this.onChange(
          this._totalOptions.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value)
        );
      } else {
        this.onChange(
          this._totalOptions.map(checkbox => ({
            checked: checkbox.checked,
            label  : checkbox.label,
            value  : checkbox.value
          }))
        );
      }
    }
  }

  ngAfterContentInit() {
    of(this._checkboxTiles)
      .pipe(merge(this._checkboxTiles.changes))
      .subscribe(items => {
        items.map(item => {
          item.change.subscribe(() => {
            this._optionChange();
          });
        });
      });
  }

  writeValue(value: any | any[]): void {
    if (isArray(value)) {
      if (this.checkboxType === 'simple') {
        this._ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this._totalOptions.forEach(_option => {
              if (!this.valueMatcher && value.includes(_option.value) ||
                isFunction(this.valueMatcher) && this.valueMatcher(_option, value)
              ) {
                _option.checked = true;
              } else {
                _option.checked = false;
              }
            });
          });
        });
      } else {
        this._totalOptions = value;
      }
    }
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
