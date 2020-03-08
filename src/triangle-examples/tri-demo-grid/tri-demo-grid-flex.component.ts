/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title grid-flex
 */
@Component({
  selector: 'tri-demo-grid-flex',
  template: `
    <div>
      <p>sub-element align left</p>
      <div tri-row [type]="'flex'" [justify]="'start'">
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
      </div>
      <p>sub-element align center</p>
      <div tri-row [type]="'flex'" [justify]="'center'">
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
      </div>
      <p>sub-element align right</p>
      <div tri-row [type]="'flex'" [justify]="'end'">
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
      </div>
      <p>sub-element monospaced arrangement</p>
      <div tri-row [type]="'flex'" [justify]="'space-between'">
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
      </div>
      <p>sub-element align full</p>
      <div tri-row [type]="'flex'" [justify]="'space-around'">
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
        <div tri-col [span]="4">
          col-4
        </div>
      </div>
    </div>`,
  styles: []
})
export class TriDemoGridFlexComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
