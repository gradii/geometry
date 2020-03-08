/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title grid-gutter
 */
@Component({
  selector: 'tri-demo-grid-gutter',
  template: `
    <div class="gutter-example">
      <div tri-row [gutter]="8">
        <div tri-col class="gutter-row" [span]="6">
          <div class="gutter-box">col-6</div>
        </div>
        <div tri-col class="gutter-row" [span]="6">
          <div class="gutter-box">col-6</div>
        </div>
        <div tri-col class="gutter-row" [span]="6">
          <div class="gutter-box">col-6</div>
        </div>
        <div tri-col class="gutter-row" [span]="6">
          <div class="gutter-box">col-6</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `  .gutter-box {
      background: #00A0E9;
      padding: 5px 0;
    }`
  ]
})
export class TriDemoGridGutterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
