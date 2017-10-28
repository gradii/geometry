import { Component, OnInit, ViewEncapsulation, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tri-rate',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul class="ant-rate"
        [class.ant-rate-disabled]="_disabled"
        (mouseleave)="_leaveRate($event)">
      <li *ngFor="let star of _starArray; let i = index"
          class="ant-rate-star"
          [class.ant-rate-star-full]="i + 1 < _hoverValue || (!_hasHalf && i + 1 === _hoverValue)"
          [class.ant-rate-star-half]="_hasHalf && i + 1 === _hoverValue"
          [class.ant-rate-star-active]="_hasHalf && i + 1 === _hoverValue"
          [class.ant-rate-star-zero]=" i + 1 > _hoverValue"

          (mouseover)="_hoverRate($event, i, true)"
          (click)="_clickRate($event, i, true)">
        <div class="ant-rate-star-first" (mouseover)="_hoverRate($event, i)" (click)="_clickRate($event, i)">
          <i class="anticon anticon-star"></i></div>
        <div class="ant-rate-star-second" (mouseover)="_hoverRate($event, i, true)" (click)="_clickRate($event, i, true)">
          <i class="anticon anticon-star"></i></div>
      </li>
    </ul>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RateComponent),
      multi: true
    }
  ]
})
export class RateComponent implements OnInit, ControlValueAccessor {
  _prefixCls = 'ant-rate';
  _classMap;
  _starArray: Array<any> = new Array();
  _count = 5;
  _value = 0;
  _hoverValue = 0; // 鼠标悬浮时的星数，为正整数，和_hasHalf配合使用
  _hasHalf = false;
  _allowHalf = false;
  _disabled = false;
  _floatReg: any = /^\d+(\.\d+)?$/;

  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;

  /**
   * Set the count of star
   * star 总数
   * @param  value
   */
  @Input()
  set count(value: number) {
    this._count = value;
  }

  /**
   * Set whether allow half select
   * 当添加该属性时允许半选
   * @param  value
   */
  @Input()
  set allowHalf(value: boolean | string) {
    if (value === '') {
      this._allowHalf = true;
    } else {
      this._allowHalf = value as boolean;
    }
  }

  /**
   * Set default value
   * 设置默认值
   * @param  value
   */
  @Input()
  set defaultValue(value: number) {
    this._value = value;
    if (this._floatReg.test(value)) {
      value += 0.5;
      this._hasHalf = true;
    }
    this._hoverValue = value;
  }

  /**
   * Get value
   * 获取值
   */
  get value(): number {
    return this._value;
  }

  /**
   * Set value
   * 设置值
   * @param  value
   */
  set value(value: number) {
    if (this._value === value) {
      return;
    }
    this._value = value;
    if (this._floatReg.test(value)) {
      value += 0.5;
      this._hasHalf = true;
    }
    this._hoverValue = value;
  }

  /**
   * Set whether disabled
   * 设置是否禁用
   * @param  value
   */
  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    // this.setClassMap();
  }

  // setClassMap(): void {
  //   this._classMap = {
  //     [this._prefixCls]              : true,
  //     [`${this._prefixCls}-disabled`]: this._disabled
  //   };
  // }

  setChildrenClassMap(): void {
    let index = 0;
    while (index < this._count) {
      this._starArray.push(index++);
    }
  }

  _clickRate(e, index, isFull): void {
    e.stopPropagation();
    if (this._disabled) {
      return;
    }
    this._hoverValue = this._value = index + 1;
    this._hasHalf = !isFull && this._allowHalf;
    if (this._hasHalf) {
      this._value -= 0.5;
    }
    this.onChange(this._value);
  }

  _hoverRate(e, index, isFull): void {
    e.stopPropagation();
    if (this._disabled) {
      return;
    }
    const isHalf: boolean = !isFull && this._allowHalf;
    // 如果星数一致，则不作操作，用于提高性能
    if (this._hoverValue === index + 1 && isHalf === this._hasHalf) {
      return;
    }

    this._hoverValue = index + 1;
    this._hasHalf = isHalf;
  }

  _leaveRate(e): void {
    e.stopPropagation();
    let oldVal = this._value;
    if (this._floatReg.test(oldVal)) {
      oldVal += 0.5;
      this._hasHalf = true;
    }
    this._hoverValue = oldVal;
  }

  writeValue(value: any): void {
    this.value = value;
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

  ngOnInit() {
    this.setChildrenClassMap();
  }
}
