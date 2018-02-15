import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

export type TriJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';
export type RowAlign = 'top' | 'middle' | 'bottom';
export type TriType = 'flex' | null;

@Component({
  selector       : '[triRow], [tri-row], tri-row',
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <ng-content></ng-content>
  `,
  host           : {
    '[class.ant-row]'                   : '!type',
    '[class.ant-row-flex]'              : 'type=="flex"',
    '[class.ant-row-flex-top]'          : 'type=="flex"&&align=="top"',
    '[class.ant-row-flex-middle]'       : 'type=="flex"&&align=="middle"',
    '[class.ant-row-flex-bottom]'       : 'type=="flex"&&align=="bottom"',
    '[class.ant-row-flex-start]'        : 'type=="flex"&&justify=="start"',
    '[class.ant-row-flex-end]'          : 'type=="flex"&&justify=="end"',
    '[class.ant-row-flex-center]'       : 'type=="flex"&&justify=="center"',
    '[class.ant-row-flex-space-around]' : 'type=="flex"&&justify=="space-around"',
    '[class.ant-row-flex-space-between]': 'type=="flex"&&justify=="space-between"',
    '[style.margin-left.px]'            : '-_gutter/2',
    '[style.margin-right.px]'           : '-_gutter/2'
  }
})
export class RowComponent implements OnInit {
  _el: HTMLElement;
  _gutter: number;
  _type: TriType;
  _align: RowAlign = 'top';
  _justify: TriJustify = 'start';

  /**
   * Set the layout type, optional `flex`
   * 设置布局模式，可选  `flex` ，现代浏览器下有效
   * @param  value
   */
  @Input()
  set type(value: TriType) {
    this._type = value;
    this.cdRef.markForCheck();
  }

  /**
   * Get the layout type
   * 获取布局模式
   */
  get type(): TriType {
    return this._type;
  }

  /**
   * Set the align in vertical layout: `top`   `middle`   `bottom`
   * 设置 flex 布局下的垂直对齐方式： `top`   `middle`   `bottom`
   * @param  value
   */
  @Input()
  set align(value: RowAlign) {
    this._align = value;
    this.cdRef.markForCheck();
  }

  /**
   * Get the align in vertical layout
   * 获取 flex 布局下垂直对齐方式
   */
  get align(): RowAlign {
    return this._align;
  }

  /**
   * Set the align in horizontal layout: `start`   `end`   `center`   `space-around`
   * 设置 flex 布局下的水平排列方式： `start`   `end`   `center`   `space-around`
   * @param  value
   */
  @Input()
  set justify(value: TriJustify) {
    this._justify = value;
    this.cdRef.markForCheck();
  }

  /**
   * Get the align in horizontal layout
   * 获取 flex 布局下的水平排列方式
   */
  get justify(): TriJustify {
    return this._justify;
  }

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
    this.cdRef.markForCheck();
  }

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    // this.setClassMap();
  }
}
