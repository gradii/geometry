/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title tabs-basic
 */
@Component({
  selector: 'tri-demo-tabs-basic',
  template: `
    <tri-tab-group type="segment" [disableRipple]="true">
      <tri-tab label="First"> Content 1</tri-tab>
      <tri-tab label="Second"> Content 2</tri-tab>
      <tri-tab label="Third"> Content 3</tri-tab>
      <tri-tab label="Fourth"> Content 4</tri-tab>
      <tri-tab label="Five"> Content 5</tri-tab>
      <tri-tab label="Six"> Content 6</tri-tab>
    </tri-tab-group>

    <tri-tab-group type="segment" [disableRipple]="true">
      <tri-tab *ngFor="let tab of tabs">
        <div *triTabLabel>
          {{tab.name}}
        </div>
        <span *triTabContent>{{tab.content}}</span>
      </tri-tab>
    </tri-tab-group>

    <tri-tab-group type="segment">
      <tri-tab label="First"> Content 1</tri-tab>
      <tri-tab label="Second"> Content 2</tri-tab>
      <tri-tab label="Third"> Content 3</tri-tab>
      <tri-tab label="Fourth"> Content 4</tri-tab>
      <tri-tab label="Five"> Content 5</tri-tab>
      <tri-tab label="Six"> Content 6</tri-tab>
    </tri-tab-group>

  `,
  styles  : []
})
export class TriDemoTabsSegmentComponent implements OnInit {
  tabs = [
    {
      name   : 'Tab 1',
      content: 'Content of Tab Pane 1'
    },
    {
      name   : 'Tab 2',
      content: 'Content of Tab Pane 2'
    },
    {
      name   : 'Tab 3',
      content: 'Content of Tab Pane 3'
    }
  ];

  constructor() {
  }

  ngOnInit() {
    setTimeout(() => {
      this.tabs[0].content = 'Change Content';
    }, 10000);
  }
}
