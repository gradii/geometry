import { Component, OnInit } from '@angular/core';

/**
 * @title popover-basic
 */
@Component({
  selector: 'tri-demo-popover-basic',
  template: `
    <tri-popover [title]="'标题'">
      <button tri-button [type]="'primary'" tri-popover>弹出卡片</button>
      <ng-template #template>
        <div><p>内容</p>
          <p>内容</p></div>
      </ng-template>
    </tri-popover>
  `
})
export class TriDemoPopoverBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
