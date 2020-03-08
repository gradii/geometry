/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title calendar-locale
 */
@Component({
  selector: 'tri-demo-calendar-locale',
  template: `
    <tri-calendar [locale]="'en'"></tri-calendar>`,
  styles: []
})
export class TriDemoCalendarLocaleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
