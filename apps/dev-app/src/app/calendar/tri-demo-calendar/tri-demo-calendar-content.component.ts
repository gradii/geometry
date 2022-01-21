/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title calendar-content
 */
@Component({
  selector: 'tri-demo-calendar-content',
  template: `
    <tri-calendar>
      <ng-template #dateCell let-day>
        <tri-badge [status]="'success'" [badgeText]="'Sunday'" *ngIf="(day.date|date:'EEE')==='Sun'"></tri-badge>
        <tri-badge [status]="'processing'" [badgeText]="'Saturday'" *ngIf="(day.date|date:'EEE')==='Sat'"></tri-badge>
      </ng-template>
      <ng-template #monthCell let-month>
        <tri-badge [status]="'success'" [badgeText]="'This Month is Sep'" *ngIf="month.index==11"></tri-badge>
      </ng-template>
    </tri-calendar>`,
  styles  : []
})
export class TriDemoCalendarContentComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
