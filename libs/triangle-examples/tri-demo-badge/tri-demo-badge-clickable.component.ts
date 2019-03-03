import { Component, OnInit } from '@angular/core';

/**
 * @title badge-clickable
 */
@Component({
  selector: 'tri-demo-badge-clickable',
  template: `
    <a href="#here">
      <tri-badge [count]="5">
        <ng-template #content>
          <a class="head-example"></a>
        </ng-template>
      </tri-badge>
    </a>
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
export class TriDemoBadgeClickAbleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
