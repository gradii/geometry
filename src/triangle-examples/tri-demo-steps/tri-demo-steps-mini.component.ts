/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title steps-mini
 */
@Component({
  selector: 'tri-demo-steps-mini',
  template: `
    <tri-steps [(current)]="current" [size]="'small'">
      <tri-step [title]="'Finished'"></tri-step>
      <tri-step [title]="'In Progress'"></tri-step>
      <tri-step [title]="'Waiting'"></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsMiniComponent implements OnInit {
  current = 1;

  constructor() {}

  ngOnInit() {}
}
