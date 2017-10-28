import { Component, HostBinding } from '@angular/core';

@Component({
  selector: '[tri-menu-divider]',
  template: `
    <ng-content></ng-content>`
})
export class MenuDividerComponent {
  @HostBinding('class.ant-dropdown-menu-item-divider') _dropdownMenuItemDivider = true;
}
