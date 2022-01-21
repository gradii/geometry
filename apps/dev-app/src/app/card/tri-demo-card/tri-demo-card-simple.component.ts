/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title card-simple
 */
@Component({
  selector: 'tri-demo-card-simple',
  template: `
    <tri-card style="width:300px;">
      <tri-card-body>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </tri-card-body>
    </tri-card>
  `,
  styles  : []
})
export class TriDemoCardSimpleComponent implements OnInit {
  ngOnInit() {
  }
}
