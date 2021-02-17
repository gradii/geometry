/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title card-simple
 */
@Component({
  selector: 'tri-demo-card-simple',
  template: `
    <tri-card style="width:300px;">
      <ng-template #body>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </ng-template>
    </tri-card>
  `,
  styles: []
})
export class TriDemoCardSimpleComponent implements OnInit {
  ngOnInit() {}
}
