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
 * @title collapse-border
 */
@Component({
  selector: 'tri-demo-collapse-border',
  template: `
    <tri-collapseset [bordered]="false">
      <tri-collapse *ngFor="let panel of panels" [title]="panel.name" [active]="panel.active">
        <p>{{panel.name}} 的内容</p>
      </tri-collapse>
    </tri-collapseset>
  `,
  styles  : []
})
export class TriDemoCollapseBorderComponent implements OnInit {
  panels = [
    {
      active     : true,
      disabled   : false,
      name       : 'This is panel header 1',
      childPannel: [
        {
          active  : false,
          disabled: true,
          name    : 'This is panel header 1-1'
        }
      ]
    },
    {
      active  : false,
      disabled: true,
      name    : 'This is panel header 2'
    },
    {
      active  : false,
      disabled: false,
      name    : 'This is panel header 3'
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
