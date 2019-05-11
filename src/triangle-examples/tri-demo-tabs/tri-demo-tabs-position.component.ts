import { Component, OnInit } from '@angular/core';

/**
 * @title tabs-position
 */
@Component({
  selector: 'tri-demo-tabs-position',
  template: `
    <div style="margin-bottom: 16px;">
      Tab position：
      <tri-select [(ngModel)]="_position" style="width: 80px;">
        <tri-option
          *ngFor="let option of options"
          [label]="option.label"
          [value]="option.value">
        </tri-option>
      </tri-select>
    </div>
    <tri-tabset [tabPosition]="_position" [type]="'line'">
      <tri-tab *ngFor="let tab of tabs">
        <ng-template #tabHeading>
          Tab {{tab.index}}
        </ng-template>
        <span>Content of tab {{tab.index}}</span>
      </tri-tab>
    </tri-tabset>`,
  styles: []
})
export class TriDemoTabsPositionComponent implements OnInit {
  _position = 'top';
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
  options = [
    { value: 'top', label: 'top' },
    { value: 'left', label: 'left' },
    { value: 'right', label: 'right' },
    { value: 'bottom', label: 'bottom' }
  ];

  constructor() {}

  ngOnInit() {}
}
