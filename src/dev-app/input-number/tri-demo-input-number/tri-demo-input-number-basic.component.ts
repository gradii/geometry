/**
 * @license
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
    <input [(ngModel)]="demoValue"/>
    <tri-input-number [(ngModel)]="demoValue" [min]="1" [max]="100" [step]="1"></tri-input-number>
  `,

  styles: []
})
export class TriDemoInputNumberBasicComponent implements OnInit {
  demoValue = 3;

  constructor() {}

  ngOnInit() {}
}
