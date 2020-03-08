/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title grid-flex-align
 */
@Component({
  selector: 'tri-demo-grid-flex-align',
  template: `
    <div>
      <p>Align Top</p>
      <div tri-row [type]="'flex'" [justify]="'center'" [align]="'top'">
        <div tri-col [span]="4">
          <p class="height-100">col-4</p>
        </div>
        <div tri-col [span]="4">
          <p class="height-50">col-4</p>
        </div>
        <div tri-col [span]="4">
          <p class="height-120">col-4</p>
        </div>
        <div tri-col [span]="4">
          <p class="height-80">col-4</p>
        </div>
      </div>
      <p>Align Center</p>
      <div tri-row [type]="'flex'" [justify]="'space-around'" [align]="'middle'">
        <div tri-col [span]="4">
          <p class="height-100">col-4</p>
        </div>
        <div tri-col [span]="4">
          <p class="height-50">col-4</p>
        </div>
        <div tri-col [span]="4">
          <p class="height-120">col-4</p>
        </div>
        <div tri-col [span]="4">
          <p class="height-80">col-4</p>
        </div>
      </div>
      <p>Align Bottom</p>
      <div tri-row [type]="'flex'" [justify]="'space-between'" [align]="'bottom'">
        <div tri-col [span]="4">
          <p class="height-100">col-4</p>
        </div>
        <div tri-col [span]="4">
          <p class="height-50">col-4</p>
        </div>
        <div tri-col [span]="4">
          <p class="height-120">col-4</p>
        </div>
        <div tri-col [span]="4">
          <p class="height-80">col-4</p>
        </div>
      </div>
    </div>`,
  styles: []
})
export class TriDemoGridFlexAlignComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
