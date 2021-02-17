import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { RadioGroupDirective } from './radio-group.directive';

import { RadioOption } from './radio.component';

@Component({
  moduleId           : module.id,
  selector           : 'tri-radio-group',
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false,
  template           : `
    <label tri-radio *ngFor="let radio of options"
           [checked]="radio?.value == _value"
           [disabled]="_disabled"
           [value]="radio?.value"
           [label]="radio?.label">
    </label>
    <ng-content></ng-content>
  `,
  host               : {
    '[class.tri-radio-group]': 'true'
  }
})
export class RadioGroupComponent extends RadioGroupDirective {
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

  @HostBinding('class.tri-radio-group-large')
  get isLarge() {
    return this._size === 'large';
  }

  @HostBinding('class.tri-radio-group-small')
  get isSmall() {
    return this._size === 'small';
  }
}
