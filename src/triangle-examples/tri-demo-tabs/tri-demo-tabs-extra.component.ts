import { Component, OnInit } from '@angular/core';

/**
 * @title tabs-extra
 */
@Component({
  selector: 'tri-demo-tabs-extra',
  template: `
    <tri-tabset>
      <tri-tab *ngFor="let tab of tabs">
        <ng-template #tabHeading>
         Tab {{tab.index}}
        </ng-template>
        <span>Content of tab {{tab.index}}</span>
      </tri-tab>
      <ng-template #tabBarExtraContent>
        <button tri-button>Extra Action</button>
      </ng-template>
    </tri-tabset>`,
  styles: []
})
export class TriDemoTabsExtraComponent implements OnInit {
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
