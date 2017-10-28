import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'tri-header',
  template: `
    <ng-content></ng-content>
  `
})
export class HeaderComponent {
  @HostBinding('class.ant-layout-header') _layoutHeader = true;
}
