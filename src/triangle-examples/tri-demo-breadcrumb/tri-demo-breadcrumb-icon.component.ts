import { Component, OnInit } from '@angular/core';

/**
 * @title breadcrumb-icon
 */
@Component({
  selector: 'tri-demo-breadcrumb-icon',
  template: `
    <tri-breadcrumb>
      <tri-breadcrumb-item>
        <i class="anticon anticon-home"></i>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a href=""><i class="anticon anticon-user"></i><span>Application List</span></a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a href="">Application</a>
      </tri-breadcrumb-item>
    </tri-breadcrumb>`,
  styles: []
})
export class TriDemoBreadCrumbIconComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
