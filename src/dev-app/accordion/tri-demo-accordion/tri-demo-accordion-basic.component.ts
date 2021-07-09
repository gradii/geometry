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
 * @title accordion-basic
 */
@Component({
  selector: 'tri-demo-accordion-basic',
  template: `
    <tri-accordion>
      <tri-accordion-item *ngFor="let panel of panels"
                    [title]="panel.name"
                    [active]="panel.active"
                    [disabled]="panel.disabled">
        <p>{{panel.name}}内容</p>
      </tri-accordion-item>
    </tri-accordion>
  `,
  styles  : []
})
export class TriDemoAccordionBasicComponent implements OnInit {
  panels = [
    {
      active    : true,
      name      : 'This is panel header 1',
      disabled  : false,
      childPanel: [
        {
          active: false,
          name  : 'This is panel header 1-1'
        }
      ]
    },
    {
      active  : false,
      disabled: true,
      name    : 'This is panel header 2'
    },
    {
      active  : true,
      disabled: false,
      name    : 'This is panel header 3'
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
