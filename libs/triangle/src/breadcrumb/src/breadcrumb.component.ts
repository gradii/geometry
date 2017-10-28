import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tri-breadcrumb',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>`
})
export class BreadCrumbComponent {
  /**
   * Separator
   * 分隔符自定义
   */
  @Input() separator = '/';
  @HostBinding('class.ant-breadcrumb') _breadcrumb = true;

  constructor() {}
}
