import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { RadioGroupDirective } from './radio-group.directive';
import { RadioOption } from './radio.component';

@Directive({
  selector: '[tri-radio-tile], [triRadioTile]'
})
export class RadioTileDirective implements RadioOption {
  _label: string;
  _value: string;
  _checked = false;
  _focused = false;
  _disabled = false;

  @Input()
  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  @Input() toggleable: boolean;

  @Input()
  @HostBinding('class.ant-radio-wrapper-checked')
  set checked(value: boolean) {
    this._checked = value;
  }

  get checked(): boolean {
    return this._checked;
  }

  /**
   * Get radio value
   * 获取当前Radio标示
   */
  @Input()
  get value(): string {
    return this._value;
  }

  /**
   * Set radio value
   * 设置当前Radio标示
   * @param  value
   */
  set value(value: string) {
    if (this._value === value) {
      return;
    }
    this._value = value;
  }

  /**
   * Get whether disabled
   * 获取是否可禁用
   */
  @Input()
  @HostBinding('class.ant-radio-wrapper-disabled')
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Set whether disabled
   * 设置是否可禁用
   * @param  value
   */
  set disabled(value: boolean) {
    this._disabled = value;
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    e.preventDefault();
    if (!this._disabled) {
      if (this.toggleable && this._checked) {
        this._checked = false;
        this.radioGroup.selectRadio(null);
      } else {
        this._checked = true;
        this.radioGroup.selectRadio(this);
      }
    }
  }

  constructor(protected radioGroup: RadioGroupDirective) {
    this.radioGroup.addRadio(this);
  }
}
