/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title switch-basic
 */
@Component({
  selector: 'tri-demo-switch-basic',
  template: `
    <tri-switch [(ngModel)]="switchValue"></tri-switch>`,
  styles: []
})
export class TriDemoSwitchBasicComponent implements OnInit {
  switchValue = false;

  constructor() {}

  ngOnInit() {}
}
