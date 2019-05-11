import { Component, OnInit } from '@angular/core';

/**
 * @title badge-standalones
 */
@Component({
  selector: 'tri-demo-badge-standalones',
  template: `
    <tri-badge [count]="25" [style]="style1"></tri-badge>
    <tri-badge [count]="4" [style]="style2"></tri-badge>
    <tri-badge [count]="109" [style]="style3"></tri-badge>
  `,
  styles: [
    `
    :host ::ng-deep .tri-badge {
      margin-right: 16px;
    }
  `
  ]
})
export class TriDemoBadgeStandAlonesComponent implements OnInit {
  style1 = {};

  style2 = {
    backgroundColor: '#fff',
    color: '#999',
    boxShadow: '0 0 0 1px #d9d9d9 inset'
  };

  style3 = {
    backgroundColor: '#87d068'
  };

  constructor() {}

  ngOnInit() {}
}
