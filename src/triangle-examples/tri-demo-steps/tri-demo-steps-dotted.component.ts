/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title steps-dotted
 */
@Component({
  selector: 'tri-demo-steps-dotted',
  template: `
    <tri-steps [(current)]="current" progressDot>
      <tri-step [title]="'Finished'" [description]="'This is a description.'"></tri-step>
      <tri-step [title]="'In Progress'" [description]="'This is a description.'"></tri-step>
      <tri-step [title]="'Waiting'" [description]="'This is a description.'"></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsDottedComponent implements OnInit {
  current = 1;

  constructor() {}

  ngOnInit() {}
}
