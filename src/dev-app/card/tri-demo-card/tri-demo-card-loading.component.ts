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
 * @title card-loading
 */
@Component({
  selector: 'tri-demo-card-loading',
  template: `
    <tri-card style="width:34%;" [loading]="true">
      <tri-card-header>
        Card title
      </tri-card-header>
      <tri-card-body>
        Whatever content
      </tri-card-body>
    </tri-card>
  `,
  styles  : []
})
export class TriDemoCardLoadingComponent implements OnInit {
  ngOnInit() {
  }
}
