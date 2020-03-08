/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title button-ghost
 */
@Component({
  selector: 'tri-demo-button-ghost',
  template: `
    <div style="background: rgb(190, 200, 200);padding: 26px 16px 16px;">
      <button tri-button [type]="'primary'" [ghost]="true">
        <span>Primary</span>
      </button>
      <button tri-button [type]="'default'" [ghost]="true">
        <span>Default</span>
      </button>
      <button tri-button [type]="'dashed'" [ghost]="true">
        <span>Dashed</span>
      </button>
      <button tri-button [type]="'danger'" [ghost]="true">
        <span>Danger</span>
      </button>
    </div>
  `,
  styles: []
})
export class TriDemoButtonGhostComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
