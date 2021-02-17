/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title alert-basic
 */
@Component({
  selector: 'tri-demo-alert-basic',
  template: `
    <tri-alert [type]="'success'">
      <span *triAlertMessage>
        <pre>Success Text</pre>
      </span>
    </tri-alert>
  `
})
export class TriDemoAlertBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
