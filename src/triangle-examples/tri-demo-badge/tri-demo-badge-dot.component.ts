import { Component, OnInit } from '@angular/core';

/**
 * @title badge-dot
 */
@Component({
  selector: 'tri-demo-badge-dot',
  template: `
    <tri-badge [isDot]="true">
      <ng-template #content><i class="anticon anticon-notification"></i></ng-template>
    </tri-badge>

    <tri-badge [isDot]="true">
      <ng-template #content>
        <a>一个链接</a>
      </ng-template>
    </tri-badge>

  `,
  styles: [
    `
    :host ::ng-deep .tri-badge {
      margin-right: 16px;
    }

    .head-example {
      width: 42px;
      height: 42px;
      border-radius: 6px;
      background: #eee;
      display: inline-block;
    }
  `
  ]
})
export class TriDemoBadgeDotComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
