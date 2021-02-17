/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title card-loading
 */
@Component({
  selector: 'tri-demo-card-loading',
  template: `
    <tri-card style="width:34%;" [loading]="true">
      <ng-template #title>
        Card title
      </ng-template>
      <ng-template #body>
        Whatever content
      </ng-template>
    </tri-card>
  `,
  styles: []
})
export class TriDemoCardLoadingComponent implements OnInit {
  ngOnInit() {}
}
