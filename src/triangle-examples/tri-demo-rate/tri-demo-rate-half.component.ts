/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title rate-half
 */
@Component({
  selector: 'tri-demo-rate-half',
  template: `<tri-rate [ngModel]="2.5" allowHalf></tri-rate>`,
  styles: []
})
export class TriDemoRateHalfComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
