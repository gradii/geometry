/**
 * @license
 * Copyright LinboLen Rights Reserved.
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
      <span alert-body>
        <pre>Success Text</pre>
      </span>
    </tri-alert>
  `
})
export class TriDemoAlertBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
