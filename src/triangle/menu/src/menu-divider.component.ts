/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, HostBinding } from '@angular/core';

@Component({
  selector: '[tri-menu-divider]',
  template: `
    <ng-content></ng-content>`
})
export class MenuDividerComponent {
  @HostBinding('class.tri-dropdown-menu-item-divider') _dropdownMenuItemDivider = true;
}
