/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

@Component({
  selector: 'd-splitter-demo-multi',
  templateUrl: './splitter-demo-multi.component.html',
  // styleUrls: ['../splitter-demo.component.scss']
})
export class SplitterDemoMultiComponent {

  constructor() {
  }

  sizeChange(size) {
    console.log(size);
  }
}
