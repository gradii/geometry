import {
  Component,
  ViewEncapsulation,
  Input,
  ElementRef,
  HostListener,
  AfterContentInit,
  Renderer2
} from '@angular/core';

export type ButtonType = 'primary' | 'dashed' | 'danger';
export type ButtonShape = 'circle' | null;
export type ButtonSize = 'small' | 'large' | 'default';

@Component({
  selector: 'tri-button, [triButton], [tri-button]',
  encapsulation: ViewEncapsulation.None,
  template: `
    <i class="anticon anticon-spin anticon-loading" style="display: inline-block" *ngIf="loading"></i>
    <ng-content></ng-content>
  `,
  host: {
    '[class.ant-btn]': 'true',
    '[class.ant-btn-primary]': 'type == "primary"',
    '[class.ant-btn-dashed]': 'type == "dashed"',
    '[class.ant-btn-danger]': 'type == "danger"',
    '[class.ant-btn-circle]': 'type == "circle"',
    '[class.ant-btn-lg]': 'size == "large"',
    '[class.ant-btn-sm]': 'size == "small"',
    '[class.ant-btn-loading]': 'loading',
    '[class.ant-btn-clicked]': '_clicked',
    '[class.ant-btn-icon-only]': '_iconOnly',
    '[class.ant-btn-background-ghost]': 'ghost'
  }
})
export class ButtonComponent implements AfterContentInit {
  _el: HTMLElement;
  nativeElement: HTMLElement;
  _iconElement: HTMLElement;
  _type: ButtonType;
  _shape: ButtonShape;
  _size: ButtonSize;
  _iconOnly = false;
  _loading = false;
  _clicked = false;
  _ghost = false;
  _prefixCls = 'ant-btn';

  /**
   * Set Ghost
   * 设置幽灵按钮
   * @param  value
   */
  @Input()
  set ghost(value: boolean) {
    this._ghost = value;
  }

  /**
   * Get ghost
   * 获取幽灵按钮
   */
  get ghost(): boolean {
    return this._ghost;
  }

  /**
   * Get button type
   * 按钮类型
   */
  @Input()
  get type(): ButtonType {
    return this._type;
  }

  /**
   * Set button type, Optional: `primary`, `dashed`, `danger`, `default`
   * 设置按钮类型，可选值为  `primary`   `dashed`   `danger`   `default`
   * @param value
   */
  set type(value: ButtonType) {
    this._type = value;
  }

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

  /**
   * Set button size, Optional: `small`, `large`, `null`
   * 设置按钮大小，可选值为  `small`   `large`  或者不设
   * @param  value
   */
  @Input()
  set size(value: ButtonSize) {
    this._size = value;
  }

  /**
   * Get button size
   * 按钮大小
   */
  get size(): ButtonSize {
    return this._size;
  }

  /**
   * Set whether loading
   * 设置按钮载入状态
   * @param  value
   */
  @Input()
  set loading(value: boolean) {
    this._loading = value;
  }

  /**
   * Get whether loading
   * 按钮载入状态
   */
  get loading(): boolean {
    return this._loading;
  }

  /** toggle button clicked animation */
  @HostListener('click')
  _onClick() {
    this._clicked = true;
    setTimeout(() => {
      this._clicked = false;
    }, 300);
  }

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {
    this._el = this._elementRef.nativeElement;
  }

  ngAfterContentInit() {
    this._iconElement = this._innerIElement;
    /** check if host children only has i element */
    if (this._iconElement && this._el.children.length === 1 && this._iconElement.isEqualNode(this._el.children[0])) {
      this._iconOnly = true;
    }
  }

  get _innerIElement() {
    return this._el.querySelector('i');
  }
}
