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

    <button triButton (click)="bordered = !bordered">Toggle Bordered {{bordered}}</button>

    <div style="background: #ECECEC;padding:30px;">
      <tri-card style="width:300px;" [bordered]="bordered">
        <tri-card-header>
          Card title
          <tri-card-header-extra>
            <a>More</a>
          </tri-card-header-extra>
        </tri-card-header>
        <tri-card-body>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </tri-card-body>
      </tri-card>
    </div>

  `,
  styles  : []
})
export class TriDemoCardBorderComponent implements OnInit {
  bordered = false;

  ngOnInit() {
  }
}
