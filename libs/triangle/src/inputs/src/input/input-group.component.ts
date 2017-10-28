import { Component, OnInit, ViewEncapsulation, Input, ElementRef, Renderer2, HostBinding } from '@angular/core';

@Component({
  selector: 'tri-input-group',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `
})
export class InputGroupComponent implements OnInit {
  _el: HTMLElement;
  _prefixCls = 'ant-input';

  @HostBinding(`class.ant-input-group-lg`)
  get _isLarge(): boolean {
    return this.size === 'lg';
  }

  @HostBinding(`class.ant-input-group-sm`)
  get _isSmall(): boolean {
    return this.size === 'sm';
  }

  /**
   * all size in `tri-input-group`
   * `tri-input-group`  中所有的  `tri-input`  的大小
   */
  @Input() size: string;

  /**
   * Whether use compact mode
   * 是否用紧凑模式
   */
  @Input()
  @HostBinding(`class.ant-input-group-compact`)
  compact = false;

  constructor(private _elementRef: ElementRef, private _render: Renderer2) {
    this._el = this._elementRef.nativeElement;
    this._render.addClass(this._el, `${this._prefixCls}-group`);
  }

  ngOnInit() {}
}
