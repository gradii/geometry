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
 * @title accordion-border
 */
@Component({
  selector: 'tri-demo-accordion-border',
  template: `
      <tri-accordion [bordered]="false">
          <tri-accordion-item *ngFor="let panel of panels" [title]="panel.name"
                              [expanded]="panel.active">
              <p>{{panel.name}} 的内容</p>
          </tri-accordion-item>
      </tri-accordion>
  `,
  styles  : []
})
export class TriDemoAccordionBorderComponent implements OnInit {
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
