/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title collapse-nest
 */
@Component({
  selector: 'tri-demo-collapse-nest',
  template: `
    <tri-collapseset>
      <tri-collapse *ngFor="let panel of panels" [title]="panel.name" [active]="panel.active">
        <p>{{panel.name}} 的内容</p>
        <div *ngIf="panel.childPanel&&panel.childPanel.length>0">
          <tri-collapseset>
            <tri-collapse *ngFor="let childPanel of panel.childPanel" [title]="childPanel.name"
                         [active]="childPanel.active">
              <p>{{childPanel.name}} 的内容</p>
            </tri-collapse>
          </tri-collapseset>
        </div>
      </tri-collapse>
    </tri-collapseset>
  `,
  styles: []
})
export class TriDemoCollapseNestComponent implements OnInit {
  panels = [
    {
      active: true,
      disabled: false,
      name: 'This is panel header 1',
      childPanel: [
        {
          active: true,
          name: 'This is panel header 1-1'
        },
        {
          active: false,
          name: 'This is panel header 1-2'
        }
      ]
    },
    {
      active: false,
      disabled: true,
      name: 'This is panel header 2'
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 3'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
