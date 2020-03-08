/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[tri-form]',
  host    : {
    '[class.tri-form-horizontal]': '_layout == "horizontal"',
    '[class.tri-form-vertical]'  : '_layout == "vertical"',
    '[class.tri-form-inline]'    : '_layout == "inline"',
  }
})
export class FormDirective implements OnInit {
  /** @internal */
  _el: HTMLElement;
  @Input()
  fixedLabel: number;

  constructor() {}

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

  ngOnInit() {}
}
