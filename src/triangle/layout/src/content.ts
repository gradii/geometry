import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'tri-content',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
  `
})
export class Content {
  @HostBinding('class.tri-layout-content') _layoutContent = true;
}
