/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title collapse-accordion
 */
@Component({
  selector: 'tri-demo-collapse-accordion',
  template: `
    <tri-collapseset [accordion]="true">
      <tri-collapse *ngFor="let panel of panels" [title]="panel.name" [active]="panel.active">
        <p>{{panel.name}} 的内容</p>
      </tri-collapse>
    </tri-collapseset>
  `,
  styles: []
})
export class TriDemoCollapseAccordionComponent implements OnInit {
  panels = [
    {
      active: true,
      name: 'This is panel header 1',
      childPanel: [
        {
          active: false,
          name: 'This is panel header 1-1'
        }
      ]
    },
    {
      active: false,
      name: 'This is panel header 2'
    },
    {
      active: false,
      name: 'This is panel header 3'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
