/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title breadcrumb-icon
 */
@Component({
  selector: 'tri-demo-breadcrumb-icon',
  template: `
    <tri-breadcrumb>
      <tri-breadcrumb-item>
        <tri-icon svgIcon="fill:home"></tri-icon>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a href="">
        <tri-icon svgIcon="outline:user"></tri-icon>
        <span>Application List</span>
      </a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a href="">Application</a>
      </tri-breadcrumb-item>
    </tri-breadcrumb>`,
  styles  : []
})
export class TriDemoBreadcrumbIconComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
