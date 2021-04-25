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
   <div> focused {{inputNum._focused}}</div>

    <tri-input-number #inputNum [(ngModel)]="demoValue" [size]="'large'" [min]="1" [max]="10" [step]="1"></tri-input-number>`,

  styles: []
})
export class TriDemoInputNumberFocusedComponent implements OnInit {
  demoValue = 3;

  constructor() {}

  ngOnInit() {}
}
