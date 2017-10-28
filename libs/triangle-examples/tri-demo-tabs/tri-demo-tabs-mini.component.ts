import { Component, OnInit } from '@angular/core';

/**
 * @title tabs-mini
 */
@Component({
  selector: 'tri-demo-tabs-mini',
  template: `
    <tri-tabset [size]="'small'">
      <tri-tab *ngFor="let tab of tabs">
        <ng-template #tabHeading>
          Tab {{tab.index}}
        </ng-template>
        <span>Content of tab {{tab.index}}</span>
      </tri-tab>
    </tri-tabset>`,
  styles: []
})
export class TriDemoTabsMiniComponent implements OnInit {
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
