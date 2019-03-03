import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'tri-anchor-link, [triAnchorLink]'
})
export class AnchorLinkDirective {
  @HostBinding('class.tri-anchor-link') _anchorLink = true;

  @HostBinding('class.tri-anchor-link-active') active: boolean = false;
}
