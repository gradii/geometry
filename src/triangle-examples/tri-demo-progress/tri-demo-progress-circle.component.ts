/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title progress-circle
 */
@Component({
  selector: 'tri-demo-progress-circle',
  template: `
    <tri-progress [ngModel]="75" [type]="'circle'"></tri-progress>
    <tri-progress [ngModel]="70" [type]="'circle'" [status]="'exception'"></tri-progress>
    <tri-progress [ngModel]="100" [type]="'circle'"></tri-progress>
  `,
  styles: []
})
export class TriDemoProgressCircleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
