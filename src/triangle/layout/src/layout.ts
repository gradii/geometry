import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'tri-layout',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
  `
})
export class Layout {
  @HostBinding('class.tri-layout-has-sider') hasSider = false;

  @HostBinding('class.tri-layout') _layout = true;
}
