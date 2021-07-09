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
 * @title accordion-accordion
 */
@Component({
  selector: 'tri-demo-accordion-accordion',
  template: `
    <tri-accordion [accordion]="true">
      <tri-accordion-item
        *ngFor="let panel of panels"
        [title]="panel.name"
        [active]="panel.active">
        <p>{{panel.name}} 的内容</p>
      </tri-accordion-item>
    </tri-accordion>
  `,
  styles  : []
})
export class TriDemoAccordionAccordionComponent implements OnInit {
  panels = [
    {
      active    : true,
      name      : 'This is panel header 1',
      childPanel: [
        {
          active: false,
          name  : 'This is panel header 1-1'
        }
      ]
    },
    {
      active: false,
      name  : 'This is panel header 2'
    },
    {
      active: false,
      name  : 'This is panel header 3'
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
