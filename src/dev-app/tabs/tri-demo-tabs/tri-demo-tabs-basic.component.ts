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
    <tri-tab-group>
      <tri-tab label="First"> Content 1</tri-tab>
      <tri-tab label="Second"> Content 2</tri-tab>
      <tri-tab label="Third"> Content 3</tri-tab>
    </tri-tab-group>

    <tri-tab-group>
      <tri-tab *ngFor="let tab of tabs">
        <div *triTabLabel>
          {{tab.name}}
        </div>
        <span *triTabContent>{{tab.content}}</span>
      </tri-tab>
    </tri-tab-group>`,
  styles  : []
})
export class TriDemoTabsBasicComponent implements OnInit {
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
    setTimeout(_ => {
      this.tabs[0].content = 'Change Content';
    }, 10000);
  }
}
