/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title input-add-on
 */
@Component({
  selector: 'tri-demo-input-add-on',
  template: `
    <tri-input-group>
      <input triInput [(ngModel)]="siteName"/>
      <ng-template #addOnBefore>http://</ng-template>
      <ng-template #addOnAfter>.com</ng-template>
    </tri-input-group>
    <div style="margin-top:16px;">
      <tri-input-group>
        <input triInput name="siteName" [(ngModel)]="siteName"/>
        <ng-template #addOnBefore>
          <tri-select style="width: 80px;" [ngModel]="'http://'">
            <tri-option [value]="'http://'">http://</tri-option>
            <tri-option [value]="'https://'">https://</tri-option>
          </tri-select>
        </ng-template>
        <ng-template #addOnAfter>
          <tri-select style="width: 70px;" [ngModel]="'.com'">
            <tri-option [value]="'.com'">.com</tri-option>
            <tri-option [value]="'.cn'">.cn</tri-option>
            <tri-option [value]="'.org'">.org</tri-option>
          </tri-select>
        </ng-template>
      </tri-input-group>
    </div>
    <div style="margin-top:16px;">
      <tri-input-group>
        <input triInput [(ngModel)]="siteName"/>
        <ng-template #addOnAfter>
          <tri-icon svgIcon="fill:setting"></tri-icon>
        </ng-template>
      </tri-input-group>
    </div>
  `,
  styles  : []
})
export class TriDemoInputAddOnComponent implements OnInit {
  siteName = 'mysite';

  constructor() {
  }

  ngOnInit() {
  }
}
