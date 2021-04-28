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
 * @title checkbox-disabled
 */
@Component({
  selector: 'tri-demo-checkbox-disabled',
  template: `
    <tri-checkbox [disabled]="true" [ngModel]="false">
    </tri-checkbox>
    <br>
    <tri-checkbox [disabled]="true" [ngModel]="true">
    </tri-checkbox>`,
  styles  : []
})
export class TriDemoCheckboxDisabledComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
