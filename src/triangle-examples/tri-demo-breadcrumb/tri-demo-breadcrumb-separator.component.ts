import { Component, OnInit } from '@angular/core';

/**
 * @title breadcrumb-separator
 */
@Component({
  selector: 'tri-demo-breadcrumb-separator',
  template: `
    <tri-breadcrumb [separator]="'>'">
      <tri-breadcrumb-item>
        Home
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a href="">Application Center</a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a href="">Application List</a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>
        An Application
      </tri-breadcrumb-item>
    </tri-breadcrumb>`,
  styles: []
})
export class TriDemoBreadCrumbSeparatorComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
