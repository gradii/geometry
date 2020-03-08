/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title progress-basic
 */
@Component({
  selector: 'tri-demo-progress-basic',
  template: `
    <tri-progress [ngModel]="30"></tri-progress>
    <tri-progress [ngModel]="50" [status]="'active'"></tri-progress>
    <tri-progress [ngModel]="70" [status]="'exception'"></tri-progress>
    <tri-progress [ngModel]="100"></tri-progress>
    <tri-progress [ngModel]="50" [showInfo]="false"></tri-progress>
  `,
  styles: []
})
export class TriDemoProgressBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
