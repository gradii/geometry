/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title alert-4-type-message
 */
@Component({
  selector: 'tri-demo-alert-4-type-message',
  template: `
    <tri-alert [type]="'success'" [message]="'Success Text'">
      <ul *triAlertDescription>
        <li>Success Description Success Description Success Description</li>
        <li>Success Description Success Description Success Description</li>
        <li>Success Description Success Description Success Description</li>
      </ul>
    </tri-alert>
  `
})
export class TriDemoAlertDescriptionUlComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
