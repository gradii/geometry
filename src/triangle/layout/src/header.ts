/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'tri-header',
  template: `
    <ng-content></ng-content>
  `
})
export class Header {
  @HostBinding('class.tri-layout-header') _layoutHeader = true;
}
