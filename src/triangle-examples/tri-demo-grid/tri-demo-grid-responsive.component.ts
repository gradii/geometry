/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title grid-responsive
 */
@Component({
  selector: 'tri-demo-grid-responsive',
  template: `
    <div tri-row>
      <div tri-col [xs]="2" [sm]="4" [md]="6" [lg]="8" [xl]="10">
        Col
      </div>
      <div tri-col [xs]="20" [sm]="16" [md]="12" [lg]="8" [xl]="4">
        Col
      </div>
      <div tri-col [xs]="2" [sm]="4" [md]="6" [lg]="8" [xl]="10">
        Col
      </div>
    </div>`,
  styles: []
})
export class TriDemoGridResponsiveComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
