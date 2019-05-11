import { Component, OnInit } from '@angular/core';

/**
 * @title tabs-basic
 */
@Component({
  selector: 'tri-demo-tabs-basic',
  template: `
    <tri-tabset>
      <tri-tab *ngFor="let tab of tabs">
        <ng-template #tabHeading>
          {{tab.name}}
        </ng-template>
        <span>{{tab.content}}</span>
      </tri-tab>
    </tri-tabset>`,
  styles: []
})
export class TriDemoTabsBasicComponent implements OnInit {
  tabs = [
    {
      name: 'Tab 1',
      content: 'Content of Tab Pane 1'
    },
    {
      name: 'Tab 2',
      content: 'Content of Tab Pane 2'
    },
    {
      name: 'Tab 3',
      content: 'Content of Tab Pane 3'
    }
  ];

  constructor() {}

  ngOnInit() {
    setTimeout(_ => {
      this.tabs[0].content = 'Change Content';
    }, 10000);
  }
}
