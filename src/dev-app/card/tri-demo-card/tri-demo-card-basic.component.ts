/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title card-basic
 */
@Component({
  selector: 'tri-demo-card-basic',
  template: `
    <tri-card style="width:300px;">
      <ng-template triCardTitle>
        Card title
      </ng-template>
      <ng-template triCardTitleExtra>
        <a>More</a>
      </ng-template>
      <ng-template triCardContent>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </ng-template>
    </tri-card>
  `,
  styles: []
})
export class TriDemoCardBasicComponent implements OnInit {
  ngOnInit() {}
}
