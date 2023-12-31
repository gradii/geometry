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
 * @title breadcrumb-basic
 */
@Component({
  selector: 'tri-demo-breadcrumb-basic',
  template: `
    <tri-breadcrumb>
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
  styles  : []
})
export class TriDemoBreadcrumbBasicComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
