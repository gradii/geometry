/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

@Component({
  selector: 'd-splitter-demo-direction',
  templateUrl: './splitter-demo-direction.component.html',
  // styleUrls: ['../splitter-demo.component.scss']
})
export class SplitterDemoDirectionComponent {

  constructor() {
  }

  sizeChange(size) {
    console.log(size);
  }
}
