import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : '[tri-form]',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
  `,
  host         : {
    '[class.ant-form-horizontal]': '_color == "horizontal"',
    '[class.ant-form-vertical]'  : '_color == "vertical"',
    '[class.ant-form-inline]'    : '_color == "inline"',
  }
})
export class FormComponent implements OnInit {
  _el: HTMLElement;

  _type = 'horizontal';

  /**
   * The layout of form
   * 表单布局
   * @param value
   */
  @Input()
  set layout(value) {
    this._type = value;
  }

  constructor() {}

  ngOnInit() {}
}
