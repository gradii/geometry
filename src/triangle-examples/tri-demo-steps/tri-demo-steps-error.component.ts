/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title steps-error
 */
@Component({
  selector: 'tri-demo-steps-error',
  template: `
    <tri-steps [(current)]="current" [status]="'error'">
      <tri-step [title]="'Finished'" [description]="'This is a description.'"></tri-step>
      <tri-step [title]="'In Progress'" [description]="'This is a description.'"></tri-step>
      <tri-step [title]="'Waiting'" [description]="'This is a description.'"></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsErrorComponent implements OnInit {
  current = 1;

  constructor() {}

  ngOnInit() {}
}
