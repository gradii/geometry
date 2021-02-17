/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title alert-4-type-message
 */
@Component({
  selector: 'tri-demo-alert-4-type-message',
  template: `
    <tri-alert [type]="'success'" [message]="'Success Text'"
      [description]="'Success Description Success Description Success Description'">
    </tri-alert>

    <tri-alert [type]="'info'" [message]="'Info Text'"
      [description]="'Info Description Info Description Info Description Info Description'">
    </tri-alert>

    <tri-alert [type]="'warning'" [message]="'Warning Text'"
      [description]="'Warning Description Warning Description Warning Description Warning Description'">
    </tri-alert>

    <tri-alert [type]="'error'" [message]="'Error Text'"
      [description]="'Error Description Error Description Error Description Error Description'">
    </tri-alert>
  `
})
export class TriDemoAlert4TypeMessageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
