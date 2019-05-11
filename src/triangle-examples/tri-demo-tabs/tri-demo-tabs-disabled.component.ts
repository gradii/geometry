import { Component, OnInit } from '@angular/core';

/**
 * @title tabs-disabled
 */
@Component({
  selector: 'tri-demo-tabs-disabled',
  template: `
    <tri-tabset>
      <tri-tab *ngFor="let tab of tabs"
        [disabled]="tab.disabled">
        <ng-template #tabHeading>
          {{tab.name}}
        </ng-template>
        <span>{{tab.name}}</span>
      </tri-tab>
    </tri-tabset>`,
  styles: []
})
export class TriDemoTabsDisabledComponent implements OnInit {
  selectedIndex = 0;
  tabs = [
    {
      name: 'Tab 1',
      disabled: false
    },
    {
      name: 'Tab 2',
      disabled: true
    },
    {
      name: 'Tab 3',
      disabled: false
    }
  ];

  constructor() {}

  ngOnInit() {}
}
