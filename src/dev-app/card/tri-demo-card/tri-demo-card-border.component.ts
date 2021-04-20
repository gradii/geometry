/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title card-border
 */
@Component({
  selector: 'tri-demo-card-border',
  template: `
    <div style="background: #ECECEC;padding:30px;">
      <tri-card style="width:300px;" [bordered]="false">
        <ng-template triCardTitle>
          Card title
        </ng-template>
        <ng-template triCardTitleExtra>
          <a>More</a>
        </ng-template>
        <ng-template triCardBody>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </ng-template>
      </tri-card>
    </div>

  `,
  styles: []
})
export class TriDemoCardBorderComponent implements OnInit {
  ngOnInit() {}
}
