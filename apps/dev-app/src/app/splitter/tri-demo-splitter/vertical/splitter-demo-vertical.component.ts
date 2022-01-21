/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

@Component({
  selector: 'd-splitter-demo-vertical',
  templateUrl: './splitter-demo-vertical.component.html',
  // styleUrls: ['../splitter-demo.component.scss']
})
export class SplitterDemoVerticalComponent {

  collapsed = true;
  disabledBarSize = '2px';
  constructor() {
  }

  sizeChange(size) {
    console.log(size);
  }
}
