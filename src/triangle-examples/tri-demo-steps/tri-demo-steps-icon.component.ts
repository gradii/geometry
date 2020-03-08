/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title steps-icon
 */
@Component({
  selector: 'tri-demo-steps-icon',
  template: `
    <tri-steps>
      <tri-step [title]="'Login'" [status]="'finish'">
        <ng-template #icon>
          <i class="anticon anticon-user"></i>
        </ng-template>
      </tri-step>
      <tri-step [title]="'Verification'" [status]="'finish'">
        <ng-template #icon>
          <i class="anticon anticon-solution"></i>
        </ng-template>
      </tri-step>
      <tri-step [title]="'Pay'" [status]="'process'">
        <ng-template #icon>
          <i class="anticon anticon-credit-card"></i>
        </ng-template>
      </tri-step>
      <tri-step [title]="'Done'" [status]="'wait'">
        <ng-template #icon>
          <i class="anticon anticon-smile-o"></i>
        </ng-template>
      </tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsIconComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
