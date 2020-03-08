/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title progress-format
 */
@Component({
  selector: 'tri-demo-progress-format',
  template: `
    <tri-progress [ngModel]="75" [type]="'circle'" [format]="_formatOne"></tri-progress>
    <tri-progress [ngModel]="100" [type]="'circle'" [format]="_formatTwo"></tri-progress>
  `,
  styles: []
})
export class TriDemoProgressFormatComponent implements OnInit {
  _formatOne = percent => `${percent} Days`;
  _formatTwo = percent => `Done`;

  constructor() {}

  ngOnInit() {}
}
