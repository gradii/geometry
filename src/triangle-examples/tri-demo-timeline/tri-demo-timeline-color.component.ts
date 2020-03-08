/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
/**
 * @title timeline-color
 */
@Component({
  selector: 'tri-demo-timeline-color',
  template: `
    <tri-timeline>
      <tri-timeline-item [color]="'green'">Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item [color]="'green'">Solve initial network problems 2015-09-01</tri-timeline-item>
      <tri-timeline-item [color]="'red'">Technical testing 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Network problems being solved 2015-09-01</tri-timeline-item>
    </tri-timeline>`,
  styles: []
})
export class TriDemoTimelineColorComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
