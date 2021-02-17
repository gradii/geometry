/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title steps-vertical-mini
 */
@Component({
  selector: 'tri-demo-steps-vertical-mini',
  template: `
    <tri-steps [(current)]="current" [direction]="'vertical'" [size]="'small'">
      <tri-step [title]="'Finished'" [description]="'This is a description.'"></tri-step>
      <tri-step [title]="'In Progress'" [description]="'This is a description.'"></tri-step>
      <tri-step [title]="'Waiting'" [description]="'This is a description.'"></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsVerticalMiniComponent implements OnInit {
  current = 1;

  constructor() {}

  ngOnInit() {}
}
