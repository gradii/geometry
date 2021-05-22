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
  selector: 'tri-demo-card-actions',
  template: `
    <tri-card style="width:300px;">
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
      <tri-card-actions>
        <tri-button-group>
          <button triButton>Btn</button>
          <button triButton>Btn</button>
          <button triButton>Btn</button>
        </tri-button-group>
      </tri-card-actions>
    </tri-card>
  `,
  styles  : []
})
export class TriDemoCardActionsComponent implements OnInit {
  ngOnInit() {
  }
}
