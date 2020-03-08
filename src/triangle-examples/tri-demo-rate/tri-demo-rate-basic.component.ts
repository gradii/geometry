/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title rate-basic
 */
@Component({
  selector: 'tri-demo-rate-basic',
  template: `<tri-rate [ngModel]="0"></tri-rate>`,
  styles: []
})
export class TriDemoRateBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
