/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title spin-size
 */
@Component({
  selector: 'tri-demo-spin-size',
  template: `
    <tri-spin [size]="'small'"></tri-spin>
    <tri-spin></tri-spin>
    <tri-spin [size]="'large'"></tri-spin>`,
  styles: [
    `:host ::ng-deep tri-spin > div {
      display: inline-block;
    }
    `
  ]
})
export class TriDemoSpinSizeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
