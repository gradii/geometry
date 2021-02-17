/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title card-grid
 */
@Component({
  selector: 'tri-demo-card-grid',
  template: `
    <div style="background: #ECECEC;padding:30px;">
      <div tri-row [gutter]="8">
        <div tri-col [span]="8">
          <tri-card>
            <ng-template #title>
              Card title
            </ng-template>
            <ng-template #body>
              <p>Card content</p>
            </ng-template>
          </tri-card>
        </div>
        <div tri-col [span]="8">
          <tri-card>
            <ng-template #title>
              Card title
            </ng-template>
            <ng-template #body>
              <p>Card content</p>
            </ng-template>
          </tri-card>
        </div>
        <div tri-col [span]="8">
          <tri-card>
            <ng-template #title>
              Card title
            </ng-template>
            <ng-template #body>
              <p>Card content</p>
            </ng-template>
          </tri-card>
        </div>
      </div>

    </div>
  `,
  styles: []
})
export class TriDemoCardGridComponent implements OnInit {
  ngOnInit() {}
}
