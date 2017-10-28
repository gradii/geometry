import { Component, OnInit } from '@angular/core';

/**
 * @title badge-status
 */
@Component({
  selector: 'tri-demo-badge-status',
  template: `
    <tri-badge [status]="'success'"></tri-badge>
    <tri-badge [status]="'error'"></tri-badge>
    <tri-badge [status]="'default'"></tri-badge>
    <tri-badge [status]="'processing'"></tri-badge>
    <tri-badge [status]="'warning'"></tri-badge>
    <br>
    <tri-badge [status]="'success'" [badgeText]="'Success'"></tri-badge>
    <br>
    <tri-badge [status]="'error'" [badgeText]="'Error'"></tri-badge>
    <br>
    <tri-badge [status]="'default'" [badgeText]="'Default'"></tri-badge>
    <br>
    <tri-badge [status]="'processing'" [badgeText]="'Processing'"></tri-badge>
    <br>
    <tri-badge [status]="'warning'" [badgeText]="'Warning'"></tri-badge>
  `,
  styles: [
    `
    :host ::ng-deep .ant-badge {
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
export class TriDemoBadgeStatusComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
