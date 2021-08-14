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
 * @title accordion-nest
 */
@Component({
  selector: 'tri-demo-accordion-nest',
  template: `
      <tri-accordion>
          <tri-accordion-item *ngFor="let panel of panels" [title]="panel.name"
                              [expanded]="panel.active">
              <p>{{panel.name}} 的内容</p>
              <div *ngIf="panel.childPanel&&panel.childPanel.length>0">
                  <tri-accordion>
                      <tri-accordion-item *ngFor="let childPanel of panel.childPanel"
                                          [title]="childPanel.name"
                                          [expanded]="childPanel.active">
                          <p>{{childPanel.name}} 的内容</p>
                      </tri-accordion-item>
                  </tri-accordion>
              </div>
          </tri-accordion-item>
      </tri-accordion>
  `,
  styles  : []
})
export class TriDemoAccordionNestComponent implements OnInit {
  panels = [
    {
      active    : true,
      disabled  : false,
      name      : 'This is panel header 1',
      childPanel: [
        {
          active: true,
          name  : 'This is panel header 1-1'
        },
        {
          active: false,
          name  : 'This is panel header 1-2'
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
