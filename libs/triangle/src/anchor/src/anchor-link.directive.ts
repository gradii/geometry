import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'tri-anchor-link, [triAnchorLink]'
})
export class AnchorLinkDirective {
  @HostBinding('class.ant-anchor-link') _anchorLink = true;

  @HostBinding('class.ant-anchor-link-active') active: boolean = false;
}
