import { Component, Host, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { RadioGroupDirective } from './radio-group.directive';

import { RadioOption } from './radio.component';

export type RadioType = 'button' | 'label' | string;

@Component({
  selector     : 'tri-radio-group',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-template [ngIf]="_radioType==='label'">
      <label tri-radio *ngFor="let radio of options"
             [checked]="radio?.value == radioGroupDirective._value"
             [disabled]="radioGroupDirective._disabled||radio.disabled"
             [value]="radio?.value"
             [label]="radio?.label">
      </label>
    </ng-template>
    <ng-template [ngIf]="_radioType==='button'">
      <button tri-radio-button *ngFor="let radio of options"
              [checked]="radio?.value == radioGroupDirective._value"
              [disabled]="radioGroupDirective._disabled||radio.disabled"
              [value]="radio?.value"
              [label]="radio?.label"></button>
    </ng-template>
    <ng-content></ng-content>
  `,
  host         : {
    '[class.tri-radio-group]': 'true',
    '[class.tri-radio-group-large]': '_size === "large"',
    '[class.tri-radio-group-small]': '_size === "small"'
  }
})
export class RadioGroupComponent /*extends RadioGroupDirective*/ {
  /** @docs-private */
  _radioType: RadioType = 'label';
  _size: string;

  @Input() options: RadioOption[] = [];

  /**
   * Get size
   * 获取大小, 只对样式样式生效
   */
  @Input()
  get size(): string {
    return this._size;
  }

  /**
   * Set size
   * 设置大小
   * @param  value
   */
  set size(value: string) {
    this._size = value;
  }

  @Input()
  get radioType(): string {
    return this._radioType;
  }

  set radioType(value: string) {
    this._radioType = value;
  }

  constructor(@Host() public radioGroupDirective: RadioGroupDirective) {
  }
}
