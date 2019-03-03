import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'tri-footer',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
  `
})
export class FooterComponent {
  @HostBinding('class.tri-layout-footer') _layoutFooter = true;
}
