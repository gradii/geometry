/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

@Component({
  selector: '[tri-menu-divider]',
  template: `<ng-content></ng-content>`,
  host    : {
    'class': 'tri-menu-item-divider'
  }
})
export class MenuDividerComponent {
}
