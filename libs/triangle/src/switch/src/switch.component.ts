import { Component, forwardRef, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * 带有文字
 * ```html
 * <tri-switch [ngModel]="false">
 * <span checked>开</span>
 * <span unchecked>关</span>
 * </tri-switch>
 * ```
 */
@Component({
  selector     : 'tri-switch',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <span [ngClass]="_classMap"
          class="ant-switch"
          [class.ant-switch-checked]="_checked"
          [class.ant-switch-disabled]="_disabled"
          [class.ant-switch-small]="_size === 'small'"
          tabindex="0">
      <span [ngClass]="_innerPrefixCls">
        <ng-template [ngIf]="_checked">
          <ng-content select="[checked]"></ng-content>
        </ng-template>
        <ng-template [ngIf]="!_checked">
          <ng-content select="[unchecked]"></ng-content>
        </ng-template>
      </span>
    </span>
  `,
  providers    : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi      : true
    }
  ]
})
export class SwitchComponent implements /* OnInit,*/ ControlValueAccessor {
  _prefixCls = 'ant-switch';
  _innerPrefixCls = `ant-switch-inner`;
  _classMap;
  _size: string;
  _checked = false;
  _disabled = false;

  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;

  /**
   * Get size
   * 开关大小
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
    // this.setClassMap();
  }

  /**
   * Get disabled
   * 获取是否禁用
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Set disabled
   * 设置是否禁用
   * @param  value
   */
  set disabled(value: boolean) {
    this._disabled = value;
    // this.setClassMap();
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    e.preventDefault();
    if (!this._disabled) {
      this.updateValue(!this._checked);
      this.onChange(this._checked);
    }
  }

  updateValue(value: any) {
    if (this._checked === value) {
      return;
    }
    this._checked = value;
    // this.setClassMap();
  }

  // setClassMap(): void {
  //   this._classMap = {
  //     ['ant-switch']         : true,
  //     [`ant-switch-checked`] : this._checked,
  //     [`ant-switch-disabled`]: this._disabled,
  //     [`ant-switch-small`]   : this._size === 'small'
  //   };
  // }

  writeValue(value: any): void {
    this.updateValue(value);
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

  // ngOnInit() {
  // this.setClassMap();
  // }
}
