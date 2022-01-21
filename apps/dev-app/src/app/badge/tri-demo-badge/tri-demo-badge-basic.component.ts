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
 * @title badge-basic
 */
@Component({
  selector: 'tri-demo-badge-basic',
  template: `
    <tri-badge [count]="5">
      <ng-template #content>
        <a class="head-example"></a>
      </ng-template>
    </tri-badge>
  `,
  styles  : [
    `
    :host ::ng-deep .tri-badge {
      margin-right: 16px;
    }

    .head-example {
      width: 42px;
      height: 42px;
      border-radius: 6px;
      background: #eee;
      display: inline-block;
    }
  `
  ]
})
export class TriDemoBadgeBasicComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
