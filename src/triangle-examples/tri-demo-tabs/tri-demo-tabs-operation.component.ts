/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title tabs-operation
 */
@Component({
  selector: 'tri-demo-tabs-operation',
  template: `
    <tri-tabset [type]="'card'">
      <tri-tab *ngFor="let tab of tabs">
        <ng-template #tabHeading>
          <div>
            {{tab.name}}
            <i class="anticon anticon-cross" (click)="closeTab(tab)"></i>
          </div>
        </ng-template>
        <span>Content of {{tab.name}}</span>
      </tri-tab>
      <ng-template #tabBarExtraContent>
        <i class="ant-tabs-new-tab anticon anticon-plus" (click)="newTab()"></i>
      </ng-template>
    </tri-tabset>`,
  styles: []
})
export class TriDemoTabsOperationComponent implements OnInit {
  tabs = [
    {
      name: 'Tab 1'
    },
    {
      name: 'Tab 2'
    }
  ];

  closeTab(tab) {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
  }

  newTab() {
    this.tabs.push({
      name: 'New Tab'
    });
  }

  constructor() {}

  ngOnInit() {}
}
