/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef,
  Input, Renderer2, ViewEncapsulation, ɵmarkDirty
} from '@angular/core';

export type ButtonColor =
  'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'default';
export type ButtonShape = 'square' | 'circle' | null;
export type ButtonSize = 'xlarge' | 'xl' |
  'large' | 'lg' |
  'default' |
  'small' | 'sm' |
  'xsmall' | 'xs';

@Directive({
  selector: '[triRaisedButton]',
  host    : {
    'class': 'tri-btn-raised',
  }
})
export class TriRaisedButton {
}

@Directive({
  selector: '[triRoundedButton]',
  host    : {
    'class'                  : 'tri-btn-rounded',
    '[class.tri-btn-rounded]': '_rounded'
  }
})
export class TriRoundedButton {
  private _rounded: boolean = true;

  @Input('triRoundedButton')
  get rounded(): boolean {
    return this._rounded;
  }

  set rounded(value: boolean) {
    this._rounded = coerceBooleanProperty(value);
  }

  static ngAcceptInputType_rounded: BooleanInput;
}

@Directive({
  selector: '[triTextButton]',
  host    : {
    'class': 'tri-btn-text'
  }
})
export class TriTextButton {
}

@Directive({
  selector: '[triOutlinedButton], [triDashedButton]',
  host    : {
    'class'                 : 'tri-btn-outlined',
    '[class.tri-btn-dashed]': '_dashed',
  }
})
export class TriOutlinedButton {
  private _dashed: boolean = false;

  @Input('triDashedButton')
  get dashed(): boolean {
    return this._dashed;
  }

  set dashed(value: boolean) {
    this._dashed = coerceBooleanProperty(value);
  }

  static ngAcceptInputType_dashed: BooleanInput;
}

@Directive({
  selector: '[triIconOnlyButton]',
  host    : {
    'class': 'tri-btn-icon-only',
  }
})
export class TriIconOnlyButton {
}

@Component({
  selector       : `[triButton], [tri-button],
  [triRaisedButton], [triRoundedButton], [triTextButton], [triOutlinedButton], [triIconOnlyButton], [triDashedButton]`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation  : ViewEncapsulation.None,
  template       : `
    <tri-icon class="tri-icon-spin" svgIcon="outline:loading" *ngIf="loading"></tri-icon>
    <ng-content *ngIf="!iconOnly || iconOnly&&!loading"></ng-content>
  `,
  styleUrls      : ['../style/button.css'],
  host           : {
    'class'                           : 'tri-btn',
    '[class.tri-btn-primary]'         : '_color === "primary"',
    '[class.tri-btn-secondary]'       : '_color === "secondary"',
    '[class.tri-btn-dashed]'          : '_color === "dashed"',
    '[class.tri-btn-success]'         : '_color === "success"',
    '[class.tri-btn-info]'            : '_color === "info"',
    '[class.tri-btn-warning]'         : '_color === "warning"',
    '[class.tri-btn-danger]'           : '_color === "danger"',
    '[class.tri-btn-circle]'          : '_shape === "circle"',
    '[class.tri-btn-square]'          : '_shape === "square"',
    '[class.tri-btn-xl]'              : '_size === "xlarge" || _size === "xl"',
    '[class.tri-btn-lg]'              : '_size === "large" || _size === "lg"',
    '[class.tri-btn-sm]'              : '_size === "small" || _size === "sm"',
    '[class.tri-btn-xs]'              : '_size === "xsmall" || _size === "xs"',
    '[class.tri-btn-loading]'         : '_loading',
    '[class.tri-btn-ghost]'           : '_ghost',
    '[class.tri-btn-background-ghost]': '_ghost'
  }
})
export class ButtonComponent implements AfterContentInit {

  _el: HTMLElement;
  nativeElement: HTMLElement;
  _iconElement: HTMLElement;
  _iconOnly = false;

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2,
              private cdRef: ChangeDetectorRef) {
    this._el = this._elementRef.nativeElement;
  }

  _color: ButtonColor;

  @Input('triIconOnlyButton')
  get iconOnly(): boolean {
    return this._iconOnly;
  }

  set iconOnly(value: boolean) {
    this._iconOnly = coerceBooleanProperty(value);
  }

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
    ɵmarkDirty(this);
    this._loading = value;
  }

  _ghost = false;

  /**
   * Get ghost
   * 获取幽灵按钮
   */
  @Input()
  get ghost(): boolean {
    return this._ghost;
  }

  /**
   * Set Ghost
   * 设置幽灵按钮
   * @param  value
   */
  set ghost(value: boolean) {
    this._ghost = coerceBooleanProperty(value);
  }


  get _innerIElement() {
    return this._el.querySelector(':scope > .tri-icon') as HTMLElement;
  }

  ngAfterContentInit() {
    this._iconElement = this._innerIElement;
    /** check if host children only has i element */
    if (this._iconElement && this._el.children.length === 1) {
      this._iconOnly = true;
    }
  }

  static ngAcceptInputType_ghost: BooleanInput;
  static ngAcceptInputType_color: ButtonColor | keyof ButtonColor | string;
  static ngAcceptInputType_size: ButtonSize | keyof ButtonSize | string;
  static ngAcceptInputType_iconOnly: BooleanInput;
}
