/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title alert-icon-close
 */
@Component({
  selector: 'tri-demo-alert-icon-close',
  template: `
    <tri-alert [type]="'info'" [message]="'Info Text'" [closeText]="'Close Now'">
    </tri-alert>
  `
})
export class TriDemoAlertIconCloseComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
