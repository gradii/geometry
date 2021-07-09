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
 * @title accordion-custom
 */
@Component({
  selector: 'tri-demo-accordion-custom',
  template: `
    <tri-accordion  [bordered]="false">
      <tri-accordion-item *ngFor="let panel of panels" [title]="panel.name" [active]="panel.active"
                   [ngStyle]="panel.customStyle">
        <p>{{panel.name}} 的内容</p>
      </tri-accordion-item>
    </tri-accordion>
  `,
  styles  : []
})
export class TriDemoAccordionCustomComponent implements OnInit {
  panels = [
    {
      active     : true,
      disabled   : false,
      name       : 'This is panel header 1',
      customStyle: {
        background     : '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border         : '0px'
      }
    },
    {
      active     : false,
      disabled   : true,
      name       : 'This is panel header 2',
      customStyle: {
        background     : '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border         : '0px'
      }
    },
    {
      active     : false,
      disabled   : false,
      name       : 'This is panel header 3',
      customStyle: {
        background     : '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border         : '0px'
      }
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
