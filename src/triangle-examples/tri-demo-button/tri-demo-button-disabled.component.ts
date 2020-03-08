/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title button-disabled
 */
@Component({
  selector: 'tri-demo-button-disabled',
  template: `
    <button tri-button [type]="'primary'">
      <span>Primary</span>
    </button>
    <button tri-button [type]="'primary'" disabled>
      <span>Primary(disabled)</span>
    </button>
    <br>
    <button tri-button [type]="'default'">
      <span>Default</span>
    </button>
    <button tri-button [type]="'default'" disabled>
      <span>Default(disabled)</span>
    </button>
    <br>
    <button tri-button [ghost]="true">
      <span>Ghost</span>
    </button>
    <button tri-button [ghost]="true" disabled>
      <span>Ghost(disabled)</span>
    </button>
    <br>
    <button tri-button [type]="'dashed'">
      <span>Dashed</span>
    </button>
    <button tri-button [type]="'dashed'" disabled>
      <span>Dashed(disabled)</span>
    </button>`,
  styles: []
})
export class TriDemoButtonDisabledComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
