/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

@Component({
  selector: '[tri-menu-group]',
  template: `
    <div class="tri-menu-item-group-title">
      <ng-content select="[title]"></ng-content>
    </div>
    <ul class="tri-menu-item-group-list">
      <ng-content></ng-content>
    </ul>`,
  host    : {
    'class': 'tri-menu-item-group'
  }
})
export class MenuGroupComponent {
}
