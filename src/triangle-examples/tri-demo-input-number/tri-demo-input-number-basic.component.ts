/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title input-number-basic
 */
@Component({
  selector: 'tri-demo-input-number-basic',
  template: `
    <tri-input-number [(ngModel)]="demoValue" [min]="1" [max]="10" [step]="1"></tri-input-number>
  `,

  styles: []
})
export class TriDemoInputNumberBasicComponent implements OnInit {
  demoValue = 3;

  constructor() {}

  ngOnInit() {}
}
