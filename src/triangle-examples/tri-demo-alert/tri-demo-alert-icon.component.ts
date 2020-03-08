/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title alert-icon
 */
@Component({
  selector: 'tri-demo-alert-icon',
  template: `
    <tri-alert [type]="'success'" [message]="'Success Tips'" [showIcon]="'true'">
    </tri-alert>
    <tri-alert [type]="'info'" [message]="'Informational Notes'" [showIcon]="'true'">
    </tri-alert>
    <tri-alert [type]="'warning'" [message]="'Warning'" [showIcon]="'true'">
    </tri-alert>
    <tri-alert [type]="'error'" [message]="'Error'" [showIcon]="'true'">
    </tri-alert>

    <tri-alert [type]="'success'" [message]="'Success Tips'"
      [description]="'Detailed description and advices about successful copywriting.'" [showIcon]="'true'"></tri-alert>
    <tri-alert [type]="'info'" [message]="'Informational Notes'"
      [description]="'Additional description and informations about copywriting.'" [showIcon]="'true'"></tri-alert>
    <tri-alert [type]="'warning'" [message]="'Warning'"
      [description]="'This is a warning notice about copywriting.'" [showIcon]="'true'"></tri-alert>
    <tri-alert [type]="'error'" [message]="'Error'"
      [description]="'This is an error message about copywriting.'" [showIcon]="'true'"></tri-alert>
  `
})
export class TriDemoAlertIconComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
