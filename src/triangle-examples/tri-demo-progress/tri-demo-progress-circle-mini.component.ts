/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title progress-circle-mini
 */
@Component({
  selector: 'tri-demo-progress-circle-mini',
  template: `
    <tri-progress [ngModel]="75" [type]="'circle'" [width]="80"></tri-progress>
    <tri-progress [ngModel]="70" [type]="'circle'" [width]="80" [status]="'exception'"></tri-progress>
    <tri-progress [ngModel]="100" [type]="'circle'" [width]="80"></tri-progress>
  `,
  styles: []
})
export class TriDemoProgressCircleMiniComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
