/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'tri-header',
  template: `
    <ng-content></ng-content>
  `,
  host    : {
    '[class.tri-layout-light]': "theme === 'light'",
    '[class.tri-layout-dark]' : "theme === 'dark'"
  }
})
export class Header {
  @Input() theme: 'light' | 'dark';

  @HostBinding('class.tri-layout-header') _layoutHeader = true;
}
