import { Component, OnInit } from '@angular/core';

/**
 * @title tabs-move
 */
@Component({
  selector: 'tri-demo-tabs-move',
  template: `
    <tri-radio-group [(ngModel)]="tabPosition">
      <label tri-radio-button [value]="'top'">
        <span>Horizontal</span>
      </label>
      <label tri-radio-button [value]="'left'">
        <span>Vertical</span>
      </label>
    </tri-radio-group>
    <tri-input-number style="float:right;" [min]="0" [max]="10" [(ngModel)]="selectedIndex"></tri-input-number>
    <tri-tabset
      style="height:220px;"
      [tabPosition]="tabPosition"
      [(selectedIndex)]="selectedIndex"
      (selectChange)="_console([$event])">
      <tri-tab *ngFor="let tab of tabs"
        (select)="_console(['select',tab])"
        (click)="_console(['click',tab])"
        (deselect)="_console(['deselect',tab])">
        <ng-template #tabHeading>
          {{tab.name}}
        </ng-template>
        <span>{{tab.content}}</span>
      </tri-tab>
    </tri-tabset>`,
  styles: []
})
export class TriDemoTabsMoveComponent implements OnInit {
  tabs = [];
  tabPosition = 'top';
  selectedIndex = 0;

  _console(args) {
    console.log(args);
  }

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 11; i++) {
      this.tabs.push({
        name: `Tab ${i}`,
        content: `Content of tab ${i}`
      });
    }
  }
}
