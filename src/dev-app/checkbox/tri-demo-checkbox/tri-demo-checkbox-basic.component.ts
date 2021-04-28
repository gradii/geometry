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
 * @title checkbox-basic
 */
@Component({
  selector: 'tri-demo-checkbox-basic',
  template: `
    <tri-checkbox [(ngModel)]="_checked" (ngModelChange)="_console($event)">
      <span>Checkbox</span>
    </tri-checkbox>`,
  styles  : []
})
export class TriDemoCheckboxBasicComponent implements OnInit {
  _checked = true;

  _console(value) {
    console.log(value);
  }

  constructor() {
  }

  ngOnInit() {
  }
}
