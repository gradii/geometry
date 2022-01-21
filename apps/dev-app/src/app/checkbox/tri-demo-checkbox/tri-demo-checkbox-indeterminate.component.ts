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
 * @title checkbox-indeterminate
 */
@Component({
  selector: 'tri-demo-checkbox-indeterminate',
  template: `
    <div style="border-bottom: 1px solid rgb(233, 233, 233);">
      <tri-checkbox [(ngModel)]="allChecked"
                    [indeterminate]="indeterminate"
                    (ngModelChange)="updateAllChecked()">
        <span>Check all</span>
      </tri-checkbox>
    </div>
    <br>
    <tri-checkbox-group [options]="checkOptionsOne"
                        [(ngModel)]="checkOptionsOneValue"
                        (ngModelChange)="updateSingleChecked()"></tri-checkbox-group>
  `,
  styles  : []
})
export class TriDemoCheckboxIndeterminateComponent implements OnInit {
  allChecked      = false;
  indeterminate   = true;
  checkOptionsOne = [
    {label: 'Apple', value: 'Apple', checked: true},
    {label: 'Pear', value: 'Pear', checked: false},
    {label: 'Orange', value: 'Orange', checked: false}
  ];

  checkOptionsOneValue: any[] = [];

  updateAllChecked() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOneValue = this.checkOptionsOne.map(item => {
        return item.value;
      });
    } else {
      this.checkOptionsOneValue = [];
    }
  }

  updateSingleChecked() {
    if (this.checkOptionsOneValue.length === 0) {
      this.allChecked    = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOneValue.length === this.checkOptionsOne.length) {
      this.allChecked    = true;
      this.indeterminate = false;
    } else {
      this.allChecked    = false;
      this.indeterminate = true;
    }
  }

  constructor() {
  }

  ngOnInit() {
  }
}
