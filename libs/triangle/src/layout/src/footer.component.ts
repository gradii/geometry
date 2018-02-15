import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'tri-footer',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
  `
})
export class FooterComponent {
  @HostBinding('class.ant-layout-footer') _layoutFooter = true;
}
