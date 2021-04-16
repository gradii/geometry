/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/** Home component which includes a welcome message for the dev-app. */
import { Component } from '@angular/core';

@Component({
  template: `
    <ul>
      <li><a routerLink="input-number">input number</a></li>
      <li><a routerLink="alert">alert</a></li>
      <li><a routerLink="tabs">tabs</a></li>
      <li><a routerLink="collapse">collapse</a></li>
      <li><a routerLink="button">button</a></li>
      <li><a routerLink="icon">icon</a></li>
      <li><a routerLink="tree-view">tree view</a></li>
      <li><a routerLink="select">select</a></li>
      <li><a routerLink="radio">radio</a></li>
    </ul>

    <dev-app-layout></dev-app-layout>
  `,
})
export class DevAppHome {
}
