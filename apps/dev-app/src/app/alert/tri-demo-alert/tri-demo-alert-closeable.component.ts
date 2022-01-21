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
 * @title alert-closeable
 */
@Component({
  selector: 'tri-demo-alert-closeable',
  template: `
    <tri-alert [type]="'warning'" [closeable]="true" [message]="'Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text'" (onClose)="afterClose()">
    </tri-alert>

    <tri-alert [type]="'error'" [closeable]="true" [message]="'Error Text'"
      [description]="'Error Description Error Description Error Description Error Description Error Description Error Description'"
      (onClose)="afterClose()"></tri-alert>
  `
})
export class TriDemoAlertCloseableComponent implements OnInit {
  afterClose() {
    console.log('close');
  }

  constructor() {
  }

  ngOnInit() {
  }
}
