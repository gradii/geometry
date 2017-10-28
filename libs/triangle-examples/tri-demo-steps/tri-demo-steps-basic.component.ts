import { Component, OnInit } from '@angular/core';

/**
 * @title steps-basic
 */
@Component({
  selector: 'tri-demo-steps-basic',
  template: `
    <tri-steps [(current)]="current">
      <tri-step [title]="'Finished'" [description]="'This is a description.'"></tri-step>
      <tri-step [title]="'In Progress'" [description]="'This is a description.'"></tri-step>
      <tri-step [title]="'Waiting'" [description]="'This is a description.'"></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsBasicComponent implements OnInit {
  current = 1;

  constructor() {}

  ngOnInit() {}
}
