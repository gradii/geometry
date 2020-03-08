/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title timeline-pending
 */
@Component({
  selector: 'tri-demo-timeline-pending',
  template: `
    <tri-timeline>
      <tri-timeline-item>Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Solve initial network problems 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Technical testing 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Network problems being solved 2015-09-01</tri-timeline-item>
      <ng-template #pending>
        <a>See more</a>
      </ng-template>
    </tri-timeline>`,
  styles: []
})
export class TriDemoTimelinePendingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
