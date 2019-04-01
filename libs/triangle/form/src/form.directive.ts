import { Component, Directive, Input, OnInit, ViewEncapsulation } from "@angular/core";

@Directive({
  selector     : '[tri-form]',
  host         : {
    '[class.tri-form-horizontal]': '_layout == "horizontal"',
    '[class.tri-form-vertical]'  : '_layout == "vertical"',
    '[class.tri-form-inline]'    : '_layout == "inline"',
  }
})
export class FormDirective implements OnInit {
  /** @internal */
  _el: HTMLElement;

  /** @internal */
  _layout = 'horizontal';

  /**
   * The layout of form
   * 表单布局
   * @param value
   */
  @Input()
  set layout(value) {
    this._layout = value;
  }

  @Input()
  fixedLabel: number;

  constructor() {}

  ngOnInit() {}
}
