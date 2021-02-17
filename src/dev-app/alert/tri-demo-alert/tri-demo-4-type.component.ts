/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title alert-4-style
 */
@Component({
  selector: 'tri-demo-alert-4-type',
  template: `
    <tri-alert [type]="'success'">
      <span *triAlertMessage>
        <pre>Success Text</pre>
      </span>
    </tri-alert>
    <tri-alert [type]="'info'">
      <span *triAlertMessage>
        <pre>Info Text</pre>
      </span>
    </tri-alert>
    <tri-alert [type]="'warning'">
      <span *triAlertMessage>
        <pre>Warning Text</pre>
      </span>
    </tri-alert>
    <tri-alert [type]="'error'">
      <span *triAlertMessage>
        <pre>Error Text</pre>
      </span>
    </tri-alert>
  `
})
export class TriDemoAlert4TypeComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
