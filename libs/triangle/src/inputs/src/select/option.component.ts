import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { SelectComponent } from './select.component';


export interface SelectOption {
  value: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
}


@Component({
  selector: 'tri-option',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: []
})
export class OptionComponent implements OnDestroy, OnInit, SelectOption {
  private _value: string;
  private _label: string;
  private _disabled = false;

  /**
   * Get the value of option
   * 获取option的value值，与tri-select选择option后的ngModel属性对应
   */
  @Input()
  get value(): string {
    return this._value;
  }

  /**
   * Set the value of option
   * 设置option的value值
   * @param  value
   */
  set value(value: string) {
    if (this._value === value) {
      return;
    }
    this._value = value;
  }

  /**
   * Get label used for show option content
   * 获取用于显示展示的option内容
   */
  @Input()
  get label(): string {
    return this._label;
  }

  /**
   * Set label value used for show option content
   * 设置用于显示展示的option内窜
   * @param  value
   */
  set label(value: string) {
    if (this._label === value) {
      return;
    }
    this._label = value;
  }

  /**
   * Get whether disabled
   * 获取是否禁用
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Set whether disabled
   * 设置是否禁用
   * @param  value
   */
  set disabled(value: boolean) {
    this._disabled = value;
  }

  constructor(private _select: SelectComponent) {}

  ngOnInit(): void {
    this._select.addOption(this);
  }

  ngOnDestroy() {
    this._select.removeOption(this);
  }
}
