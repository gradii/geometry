/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title input-number-size
 */
@Component({
  selector: 'tri-demo-input-number-size',
  template: `
    <tri-input-number [(ngModel)]="demoValue" [size]="'large'" [min]="1" [max]="10" [step]="1"></tri-input-number>
    <tri-input-number [(ngModel)]="demoValue" [min]="1" [max]="10" [step]="1"></tri-input-number>
    <tri-input-number [(ngModel)]="demoValue" [size]="'small'" [min]="1" [max]="10" [step]="1"></tri-input-number>`,

  styles: []
})
export class TriDemoInputNumberSizeComponent implements OnInit {
  demoValue = 3;

  constructor() {}

  ngOnInit() {}
}
