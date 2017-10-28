import {
  Component,
  Input,
  OnInit,
  ElementRef,
  HostBinding,
  OnChanges,
  Renderer2,
  SimpleChange,
  Host,
  Optional
} from '@angular/core';
import { RowComponent } from './row.component';

export abstract class EmbeddedProperty {
  span: number;
  pull: number;
  push: number;
  offset: number;
  order: number;
}

@Component({
  selector: 'tri-col',
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class ColComponent implements OnInit, OnChanges {
  _classList: Array<string> = [];
  _el: HTMLElement;

  // _prefixCls                = 'ant-col';

  @HostBinding('style.padding-left.px')
  get paddingLeft() {
    return this._row && this._row._gutter / 2;
  }

  @HostBinding('style.padding-right.px')
  get paddingRight() {
    return this._row && this._row._gutter / 2;
  }

  /**
   * The span of the grid, when set to `0` it means that `display:none`
   * 栅格占位格数，为 0 时相当于  `display: none`
   */
  @Input() span: number;

  /**
   * The order of the grid, valid in flex layout
   * 栅格顺序， `flex`  布局模式下有效
   */
  @Input() order: number;

  /**
   * The offset of grid
   * 栅格左侧的间隔格数，间隔内不可以有栅格
   */
  @Input() offset: number;

  /**
   * Right offset of the grid number
   * 栅格向右移动格数
   */
  @Input() push: number;

  /**
   * Left offset of the grid number
   * 栅格向左移动格数
   */
  @Input() pull: number;

  /**
   * `<768px` the responsive grid, can set number or `EmbeddedProperty`
   * `<768px` 响应式栅格，可为栅格数或一个包含其他属性的对象
   */
  @Input() xs: number | EmbeddedProperty;

  /**
   * `>=768px` the responsive grid, can set number or `EmbeddedProperty`
   * `>=768px` 响应式栅格，可为栅格数或一个包含其他属性的对象
   */
  @Input() sm: number | EmbeddedProperty;

  /**
   * `>=992px` the responsive grid, can set number or `EmbeddedProperty`
   * `>=992px` 响应式栅格，可为栅格数或一个包含其他属性的对象
   */
  @Input() md: number | EmbeddedProperty;

  /**
   * `>=1200px` the responsive grid, can set number or `EmbeddedProperty`
   * `>=1200px` 响应式栅格，可为栅格数或一个包含其他属性的对象
   */
  @Input() lg: number | EmbeddedProperty;

  /**
   * `>=1600px` the responsive grid, can set number or `EmbeddedProperty`
   * `>=1600px` 响应式栅格，可为栅格数或一个包含其他属性的对象
   */
  @Input() xl: number | EmbeddedProperty;

  /** temp solution since no method add classMap to host https://github.com/angular/angular/issues/7289*/
  setClassMap(): void {
    this._classList.forEach(_className => {
      this._renderer.removeClass(this._el, _className);
    });
    this._classList = [
      this.span && `ant-col-${this.span}`,
      this.order && `ant-col-order-${this.order}`,
      this.offset && `ant-col-offset-${this.offset}`,
      this.pull && `ant-col-pull-${this.pull}`,
      this.push && `ant-col-push-${this.push}`,
      ...this.generateClass()
    ];
    this._classList = this._classList.filter(item => {
      return !!item;
    });
    this._classList.forEach(_className => {
      this._renderer.addClass(this._el, _className);
    });
  }

  generateClass() {
    const listOfSizeInputName = ['xs', 'sm', 'md', 'lg', 'xl'];
    const listOfClassName = [];
    listOfSizeInputName.forEach(name => {
      const sizeName = name.toLowerCase();
      if (typeof this[name] === 'number' || typeof this[name] === 'string') {
        listOfClassName.push(this[name] && `ant-col-${sizeName}-${this[name]}`);
      } else {
        listOfClassName.push(this[name] && this[name]['span'] && `ant-col-${sizeName}-${this[name]['span']}`);
        listOfClassName.push(this[name] && this[name]['pull'] && `ant-col-${sizeName}-pull-${this[name]['pull']}`);
        listOfClassName.push(this[name] && this[name]['push'] && `ant-col-${sizeName}-push-${this[name]['push']}`);
        listOfClassName.push(
          this[name] && this[name]['offset'] && `ant-col-${sizeName}-offset-${this[name]['offset']}`
        );
        listOfClassName.push(this[name] && this[name]['order'] && `ant-col-${sizeName}-order-${this[name]['order']}`);
      }
    });
    return listOfClassName;
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    this.setClassMap();
  }

  constructor(
    private _elementRef: ElementRef,
    @Optional()
    @Host()
    public _row: RowComponent,
    private _renderer: Renderer2
  ) {
    this._el = this._elementRef.nativeElement;
  }

  ngOnInit(): any {
    this.setClassMap();
  }
}
