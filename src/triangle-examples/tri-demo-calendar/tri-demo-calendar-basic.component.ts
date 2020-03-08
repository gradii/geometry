/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title calendar-basic
 */
@Component({
  selector: 'tri-demo-calendar-basic',
  template: `
    <tri-calendar [locale]="'zh-cn'"></tri-calendar>`,
  styles: []
})
export class TriDemoCalendarBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
