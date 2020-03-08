/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title checkbox-indeterminate
 */
@Component({
  selector: 'tri-demo-checkbox-indeterminate',
  template: `
    <div style="border-bottom: 1px solid rgb(233, 233, 233);">
      <tri-checkbox [(ngModel)]="allChecked" (ngModelChange)="updateAllChecked()" [indeterminate]="indeterminate">
        <span>Check all</span>
      </tri-checkbox>
    </div>
    <br>
    <tri-checkbox-group [(ngModel)]="checkOptionsOne" (ngModelChange)="updateSingleChecked()"></tri-checkbox-group>
  `,
  styles: []
})
export class TriDemoCheckboxIndeterminateComponent implements OnInit {
  allChecked = false;
  indeterminate = true;
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false }
  ];

  updateAllChecked() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne.forEach(item => (item.checked = true));
    } else {
      this.checkOptionsOne.forEach(item => (item.checked = false));
    }
  }

  updateSingleChecked() {
    if (this.checkOptionsOne.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  constructor() {}

  ngOnInit() {}
}
