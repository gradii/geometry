import { Input } from '@angular/core';
import { isNullOrEmptyString } from '../../utils';
export const toJSON = xs => xs.map(x => x.toJSON());
export class FilterOperatorBase {
  protected operator: string;
  private messages;
  private _text;
  constructor(operator: string) {
    this.operator = operator;
    this.messages = {
      eq: '相等',
      neq: '不等于',
      gte: '大于等于',
      gt: '大于',
      lte: '小于等于',
      lt: '小于',
      isnull: '为Null',
      isnotnull: '不为Null',
      isempty: '为空',
      isnotempty: '不为空',
      contains: '包含',
      doesnotcontain: '不包含',
      startswith: '开始于',
      endswith: '结束于'
    };
    this._text = this.messages[this.operator];
  }

  @Input()
  get text() {
    return this._text;
  }

  set text(value) {
    this._text = isNullOrEmptyString(value) ? this.messages[this.operator] : value;
  }
  toJSON(): {
    text: string;
    value: string;
  } {
    return {
      text: this.text,
      value: this.operator
    };
  }
}
