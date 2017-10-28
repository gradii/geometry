import { Component, OnInit, Input, ContentChild, ViewEncapsulation, TemplateRef } from '@angular/core';

@Component({
  selector: 'tri-timeline-item',
  encapsulation: ViewEncapsulation.None,
  template: `
    <li
      class="ant-timeline-item"
      [class.ant-timeline-item-last]="_lastItem">
      <div class="ant-timeline-item-tail"></div>
      <div class="ant-timeline-item-head"
        [class.ant-timeline-item-head-custom]="_custom"
        [ngClass]="itemHeadClass">
        <ng-template [ngTemplateOutlet]="_customContent">
        </ng-template>
      </div>
      <div class="ant-timeline-item-content">
        <ng-content></ng-content>
      </div>
    </li>`,
  styleUrls: []
})
export class TimelineItemComponent implements OnInit {
  itemHeadClass = { 'ant-timeline-item-head-blue': true };
  _color = 'blue';
  _custom = false;
  _lastItem = false;

  /**
   * #custom
   */
  @ContentChild('custom') _customContent: TemplateRef<any>;

  /**
   * Get the color, fixture: `green`，`red`，`blue`
   * 获取圈的颜色，固定为 `green`，`red`，`blue`
   */
  @Input()
  get color() {
    return this._color;
  }

  /**
   * Set color, fixture: `green`，`red`，`blue`
   * 设置颜色
   * @param  color
   */
  set color(color: string) {
    this._color = color;
    if (color === 'green') {
      this.itemHeadClass['ant-timeline-item-head-green'] = true;
    } else if (color === 'red') {
      this.itemHeadClass['ant-timeline-item-head-red'] = true;
    } else {
      this.itemHeadClass['ant-timeline-item-head-blue'] = true;
    }
  }

  constructor() {}

  ngOnInit() {
    if (this._customContent) {
      this._custom = true;
    }
  }
}
