/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title grid-basic
 */
@Component({
  selector: 'tri-demo-grid-basic',
  template: `
    <div tri-row>
      <div tri-col [span]="12">
        col-12
      </div>
      <div tri-col [span]="12">
        col-12
      </div>
    </div>
    <div tri-row>
      <div tri-col [span]="8">
        col-8
      </div>
      <div tri-col [span]="8">
        col-8
      </div>
      <div tri-col [span]="8">
        col-8
      </div>
    </div>
    <div tri-row>
      <div tri-col [span]="6">
        col-6
      </div>
      <div tri-col [span]="6">
        col-6
      </div>
      <div tri-col [span]="6">
        col-6
      </div>
      <div tri-col [span]="6">
        col-6
      </div>
    </div>`,
  styles: []
})
export class TriDemoGridBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
