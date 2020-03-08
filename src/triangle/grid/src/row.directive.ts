/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Input, OnInit } from '@angular/core';

export type TriJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';
export type RowAlign = 'top' | 'middle' | 'bottom';
export type TriType = 'flex' | 'legacy';

@Directive({
  selector: '[triRow], [tri-row], tri-row',
  host    : {
    '[class.tri-row]'                   : '!type',
    '[class.tri-row-flex]'              : 'type=="flex"',
    '[class.tri-row-flex-top]'          : 'type=="flex"&&align=="top"',
    '[class.tri-row-flex-middle]'       : 'type=="flex"&&align=="middle"',
    '[class.tri-row-flex-bottom]'       : 'type=="flex"&&align=="bottom"',
    '[class.tri-row-flex-start]'        : 'type=="flex"&&justify=="start"',
    '[class.tri-row-flex-end]'          : 'type=="flex"&&justify=="end"',
    '[class.tri-row-flex-center]'       : 'type=="flex"&&justify=="center"',
    '[class.tri-row-flex-space-around]' : 'type=="flex"&&justify=="space-around"',
    '[class.tri-row-flex-space-between]': 'type=="flex"&&justify=="space-between"',
    '[style.margin-left.px]'            : '-_gutter/2',
    '[style.margin-right.px]'           : '-_gutter/2'
  }
})
export class RowDirective implements OnInit {
  _el: HTMLElement;

  constructor() {
  }

  _gutter: number;

  /**
   * Get the size of the gutter.
   * 栅格间隔
   */
  @Input()
  get gutter(): number {
    return this._gutter;
  }

  /**
   * Set the size of the gutter
   * @param  value
   */
  set gutter(value: number) {
    this._gutter = value;
  }

  _type: TriType = 'flex';

  /**
   * Get the layout type
   * 获取布局模式
   */
  get type(): TriType {
    return this._type;
  }

  /**
   * Set the layout type, optional `flex`
   * 设置布局模式，可选  `flex` ，现代浏览器下有效
   * @param  value
   */
  @Input()
  set type(value: TriType) {
    this._type = value;
  }

  _align: RowAlign = 'top';

  /**
   * Get the align in vertical layout
   * 获取 flex 布局下垂直对齐方式
   */
  get align(): RowAlign {
    return this._align;
  }

  /**
   * Set the align in vertical layout: `top`   `middle`   `bottom`
   * 设置 flex 布局下的垂直对齐方式： `top`   `middle`   `bottom`
   * @param  value
   */
  @Input()
  set align(value: RowAlign) {
    this._align = value;
  }

  _justify: TriJustify = 'start';

  /**
   * Get the align in horizontal layout
   * 获取 flex 布局下的水平排列方式
   */
  get justify(): TriJustify {
    return this._justify;
  }

  /**
   * Set the align in horizontal layout: `start`   `end`   `center`   `space-around`
   * 设置 flex 布局下的水平排列方式： `start`   `end`   `center`   `space-around`
   * @param  value
   */
  @Input()
  set justify(value: TriJustify) {
    this._justify = value;
  }

  ngOnInit() {
    // this.setClassMap();
  }
}
