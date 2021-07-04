/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : '[tri-form]',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>`,
  styleUrls    : ['../style/form.css'],
  host         : {
    '[class.tri-form-horizontal]': '_layout == "horizontal"',
    '[class.tri-form-vertical]'  : '_layout == "vertical"',
    '[class.tri-form-inline]'    : '_layout == "inline"',
  }
})
export class FormComponent implements OnInit {
  @Input()
  fixedLabel: number;

  constructor() {
  }

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

  ngOnInit() {
  }
}
