/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title anchor-fixed
 */
@Component({
  selector: 'tri-demo-anchor-fixed',
  template: `
  <tri-affix>
    <tri-anchor>
      <tri-anchor-link href="#何时使用" title="何时使用"></tri-anchor-link>
      <tri-anchor-link href="#components-anchor-demo-basic" title="Basic demo"></tri-anchor-link>
      <tri-anchor-link href="#API" title="API">
        <tri-anchor-link href="#API-Anchor" title="tri-anchor"></tri-anchor-link>
        <tri-anchor-link href="#API-AnchorLink" title="tri-link"></tri-anchor-link>
      </tri-anchor-link>
    </tri-anchor>
  </tri-affix>
  `,
  styles: [
    `
    :host ::ng-deep tri-anchor {
      display: block;
      width: 250px;
    }
    `
  ]
})
export class TriDemoAnchorFixedComponent {}
