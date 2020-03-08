/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title tabs-card
 */
@Component({
  selector: 'tri-demo-tabs-card',
  template: `
    <tri-tabset [tabPosition]="'top'" [type]="'card'">
      <tri-tab *ngFor="let tab of tabs">
        <ng-template #tabHeading>
          Tab {{tab.index}}
        </ng-template>
        <span>Content of Tab Pane {{tab.index}}</span>
      </tri-tab>
    </tri-tabset>`,
  styles: []
})
export class TriDemoTabsCardComponent implements OnInit {
  tabs = [
    {
      index: 1
    },
    {
      index: 2
    },
    {
      index: 3
    }
  ];

  constructor() {}

  ngOnInit() {}
}
