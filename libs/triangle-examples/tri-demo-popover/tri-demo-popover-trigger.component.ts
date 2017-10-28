import { Component, OnInit } from '@angular/core';

/**
 * @title popover-trigger
 */
@Component({
  selector: 'tri-demo-popover-trigger',
  template: `
    <tri-popover [title]="'标题'" [trigger]="'click'">
      <button tri-button tri-popover>点击</button>
      <ng-template #template>
        <div><p>内容</p>
          <p>内容</p></div>
      </ng-template>
    </tri-popover>
    <tri-popover [title]="'标题'" [trigger]="'hover'">
      <button tri-button tri-popover>移入</button>
      <ng-template #template>
        <div><p>内容</p>
          <p>内容</p></div>
      </ng-template>
    </tri-popover>
    <tri-popover [title]="'标题'" [trigger]="'focus'">
      <button tri-button tri-popover>聚焦</button>
      <ng-template #template>
        <div><p>内容</p>
          <p>内容</p></div>
      </ng-template>
    </tri-popover>
  `
})
export class TriDemoPopoverTriggerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
