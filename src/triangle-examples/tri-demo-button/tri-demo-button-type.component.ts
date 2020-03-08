/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title button-type
 */
@Component({
  selector: 'tri-demo-button-type',
  template: `
    <button tri-button [type]="'primary'">
      <span>Primary</span>
    </button>
    <button tri-button [type]="'default'">
      <span>Default</span>
    </button>
    <button tri-button [type]="'dashed'">
      <span>Dashed</span>
    </button>
    <button tri-button [type]="'danger'">
      <span>Danger</span>
    </button>`,
  styles: []
})
export class TriDemoButtonTypeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
