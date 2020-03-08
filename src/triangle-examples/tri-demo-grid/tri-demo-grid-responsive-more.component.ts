/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title grid-responsive-more
 */
@Component({
  selector: 'tri-demo-grid-responsive-more',
  template: `
    <div tri-row>
      <div tri-col [xs]="{ span: 5, offset: 1 }" [lg]="{ span: 6, offset: 2 }">
        Col
      </div>
      <div tri-col [xs]="{ span: 11, offset: 1 }" [lg]="{ span: 6, offset: 2 }">
        Col
      </div>
      <div tri-col [xs]="{ span: 5, offset: 1 }" [lg]="{ span: 6, offset: 2 }">
        Col
      </div>
    </div>`,
  styles: []
})
export class TriDemoGridResponsiveMoreComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
