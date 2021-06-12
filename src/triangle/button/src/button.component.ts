/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener,
  Input, Renderer2, ViewEncapsulation
} from '@angular/core';

export type ButtonColor =
  'primary'
  | 'warning'
  | 'success'
  | 'dashed'
  | 'danger'
  | 'highlight'
  | 'default';
export type ButtonShape = 'circle' | null;
export type ButtonSize = 'small' | 'large' | 'default';

@Component({
  selector           : '[triButton], [tri-button]',
  changeDetection    : ChangeDetectionStrategy.OnPush,
  encapsulation      : ViewEncapsulation.None,
  template           : `
    <i class="anticon anticon-spin anticon-loading" style="display: inline-block" *ngIf="loading"></i>
    <ng-content></ng-content>
  `,
  styleUrls          : ['../style/button.css'],
  host               : {
    'class'                           : 'tri-btn',
    '[class.tri-btn-primary]'         : '_color === "primary"',
    '[class.tri-btn-dashed]'          : '_color === "dashed"',
    '[class.tri-btn-success]'         : '_color === "success"',
    '[class.tri-btn-warning]'         : '_color === "warning"',
    '[class.tri-btn-danger]'          : '_color === "danger"',
    '[class.tri-btn-highlight]'       : '_color === "highlight"',
    '[class.tri-btn-circle]'          : '_shape === "circle"',
    '[class.tri-btn-lg]'              : '_size === "large"',
    '[class.tri-btn-sm]'              : '_size === "small"',
    '[class.tri-btn-loading]'         : '_loading',
    '[class.tri-btn-clicked]'         : '_clicked',
    '[class.tri-btn-icon-only]'       : '_iconOnly',
    '[class.tri-btn-background-ghost]': '_ghost'
  }
})
export class ButtonComponent implements AfterContentInit {
  _el: HTMLElement;
  nativeElement: HTMLElement;
  _iconElement: HTMLElement;
  _iconOnly = false;
  _clicked = false;
  _prefixCls = 'tri-btn';

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2, private cdRef: ChangeDetectorRef) {
    this._el = this._elementRef.nativeElement;
  }

  _color: ButtonColor;

  @Input()
  get color(): ButtonColor {
    return this._color;
  }

  set color(value: ButtonColor) {
    this._color = value;
  }

  _shape: ButtonShape;

  /**
   * Get shape of button
   * 按钮形状
   */
  @Input()
  get shape(): ButtonShape {
    return this._shape;
  }

  /**
   * Set shape of button
   * 设置按钮形状，可选值为  `circle`  或者不设
   * @param  value
   */
  set shape(value: ButtonShape) {
    this._shape = value;
  }

  _size: ButtonSize;

  /**
   * Get button size
   * 按钮大小
   */
  @Input()
  get size(): ButtonSize {
    return this._size;
  }

  set size(value: ButtonSize) {
    this._size = value;
  }

  _loading = false;

  /**
   * Get whether loading
   * 按钮载入状态
   */
  get loading(): boolean {
    return this._loading;
  }

  /**
   * Set button size, Optional: `small`, `large`, `null`
   * 设置按钮大小，可选值为  `small`   `large`  或者不设
   * @param  value
   */

  /**
   * Set whether loading
   * 设置按钮载入状态
   * @param  value
   */
  @Input()
  set loading(value: boolean) {
    this._loading = value;
  }

  _ghost = false;

  /**
   * Get ghost
   * 获取幽灵按钮
   */
  get ghost(): boolean {
    return this._ghost;
  }

  /**
   * Set Ghost
   * 设置幽灵按钮
   * @param  value
   */
  @Input()
  set ghost(value: boolean) {
    this._ghost = value;
  }


  get _innerIElement() {
    return this._el.querySelector('i');
  }

  /** toggle button clicked animation */
  @HostListener('click')
  _onClick() {
    this._clicked = true;
    // this.cdRef.markForCheck();
    setTimeout(() => {
      this._clicked = false;
      // this.cdRef.markForCheck();
    }, 300);
  }

  ngAfterContentInit() {
    this._iconElement = this._innerIElement;
    /** check if host children only has i element */
    if (this._iconElement && this._el.children.length === 1 && this._iconElement.isEqualNode(this._el.children[0])) {
      this._iconOnly = true;
    }
  }
}
