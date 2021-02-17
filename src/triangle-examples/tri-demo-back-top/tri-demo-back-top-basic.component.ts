/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title back-top-basic
 */
@Component({
  selector: 'tri-demo-back-top-basic',
  template: `
    <tri-back-top></tri-back-top>
    Scroll down to see the bottom-right
    <strong> gray </strong>
    button.
  `,
  styles: [
    `
  :host ::ng-deep strong {
    color: rgba(64, 64, 64, 0.6);
  }
  `
  ]
})
export class TriDemoBackTopBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
