/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title progress-line-dynamic
 */
@Component({
  selector: 'tri-demo-progress-line-dynamic',
  template: `
    <tri-progress [ngModel]="_percent"></tri-progress>
    <tri-button-group>
      <button tri-button (click)="decline()" [type]="'ghost'"><i class="anticon anticon-minus"></i></button><button tri-button [type]="'ghost'" (click)="increase()"><i class="anticon anticon-plus"></i></button>
    </tri-button-group>
  `,
  styles: []
})
export class TriDemoProgressLineDynamicComponent implements OnInit {
  _percent = 0;

  increase() {
    this._percent = this._percent + 10;
    if (this._percent > 100) {
      this._percent = 100;
    }
  }

  decline() {
    this._percent = this._percent - 10;
    if (this._percent < 0) {
      this._percent = 0;
    }
  }

  constructor() {}

  ngOnInit() {}
}
