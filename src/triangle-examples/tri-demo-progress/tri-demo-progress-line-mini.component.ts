/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title progress-line-mini
 */
@Component({
  selector: 'tri-demo-progress-line-mini',
  template: `
    <div style="width: 170px;">
      <tri-progress [ngModel]="30" [strokeWidth]="5"></tri-progress>
      <tri-progress [ngModel]="50" [strokeWidth]="5" [status]="'active'"></tri-progress>
      <tri-progress [ngModel]="70" [strokeWidth]="5" [status]="'exception'"></tri-progress>
      <tri-progress [ngModel]="100" [strokeWidth]="5"></tri-progress>
      <tri-progress [ngModel]="50" [strokeWidth]="5" [showInfo]="false"></tri-progress>
    </div>
  `,
  styles: []
})
export class TriDemoProgressLineMiniComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
