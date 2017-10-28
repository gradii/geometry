import { Component, OnInit } from '@angular/core';

/**
 * @title anchor-basic
 */
@Component({
  selector: 'tri-demo-anchor-basic',
  template: `
  <tri-anchor>
    <tri-anchor-link href="#何时使用" title="何时使用"></tri-anchor-link>
    <tri-anchor-link href="#components-anchor-demo-basic" title="Basic demo"></tri-anchor-link>
    <tri-anchor-link href="#API" title="API">
      <tri-anchor-link href="#API-Anchor" title="tri-anchor"></tri-anchor-link>
      <tri-anchor-link href="#API-AnchorLink" title="tri-anchor-link"></tri-anchor-link>
    </tri-anchor-link>
  </tri-anchor>
  `
})
export class TriDemoAnchorBasicComponent {}
