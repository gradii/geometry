/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title switch-disabled
 */
@Component({
  selector: 'tri-demo-switch-disabled',
  template: `
    <tri-switch [(ngModel)]="switchValue" [disabled]="isDisabled"></tri-switch>
    <div style="margin-top:8px;">
      <button tri-button [type]="'primary'" (click)="toggleDisabled()">Toggle disabled</button>
    </div>`,
  styles: []
})
export class TriDemoSwitchDisabledComponent implements OnInit {
  switchValue = false;
  isDisabled = true;
  toggleDisabled = () => {
    this.isDisabled = !this.isDisabled;
  };

  constructor() {}

  ngOnInit() {}
}
