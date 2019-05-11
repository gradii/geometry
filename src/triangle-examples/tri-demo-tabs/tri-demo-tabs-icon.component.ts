import { Component, OnInit } from '@angular/core';

/**
 * @title tabs-icon
 */
@Component({
  selector: 'tri-demo-tabs-icon',
  template: `
    <tri-tabset>
      <tri-tab *ngFor="let tab of tabs">
        <ng-template #tabHeading>
          <i [ngClass]="tab.icon"></i>
          {{tab.name}}
        </ng-template>
        <span>{{tab.name}}</span>
      </tri-tab>
    </tri-tabset>`,
  styles: []
})
export class TriDemoTabsIconComponent implements OnInit {
  tabs = [
    {
      active: true,
      name: 'Tab 1',
      icon: 'anticon anticon-apple'
    },
    {
      active: false,
      name: 'Tab 2',
      icon: 'anticon anticon-android'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
