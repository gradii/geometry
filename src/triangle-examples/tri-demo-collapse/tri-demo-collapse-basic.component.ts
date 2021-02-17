/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title collapse-basic
 */
@Component({
  selector: 'tri-demo-collapse-basic',
  template: `
    <tri-collapseset>
      <tri-collapse *ngFor="let panel of panels" [title]="panel.name" [active]="panel.active"
                   [disabled]="panel.disabled">
        <p>{{panel.name}}内容</p>
      </tri-collapse>
    </tri-collapseset>
  `,
  styles: []
})
export class TriDemoCollapseBasicComponent implements OnInit {
  panels = [
    {
      active: true,
      name: 'This is panel header 1',
      disabled: false,
      childPanel: [
        {
          active: false,
          name: 'This is panel header 1-1'
        }
      ]
    },
    {
      active: false,
      disabled: true,
      name: 'This is panel header 2'
    },
    {
      active: true,
      disabled: false,
      name: 'This is panel header 3'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
