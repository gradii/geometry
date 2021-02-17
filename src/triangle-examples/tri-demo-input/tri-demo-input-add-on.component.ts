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
    <tri-input [(ngModel)]="siteName">
      <ng-template #addOnBefore>http://</ng-template>
      <ng-template #addOnAfter>.com</ng-template>
    </tri-input>
    <div style="margin-top:16px;">
      <tri-input [(ngModel)]="siteName">
        <ng-template #addOnBefore>
          <tri-select style="width: 80px;" [ngModel]="'http://'">
            <tri-option [label]="'http://'" [value]="'http://'"></tri-option>
            <tri-option [label]="'https://'" [value]="'https://'"></tri-option>
          </tri-select>
        </ng-template>
        <ng-template #addOnAfter>
          <tri-select style="width: 70px;" [ngModel]="'.com'">
            <tri-option [label]="'.com'" [value]="'.com'"></tri-option>
            <tri-option [label]="'.jp'" [value]="'.jp'"></tri-option>
            <tri-option [label]="'.cn'" [value]="'.cn'"></tri-option>
            <tri-option [label]="'.org'" [value]="'.org'"></tri-option>
          </tri-select>
        </ng-template>
      </tri-input>
    </div>
    <div style="margin-top:16px;">
      <tri-input [(ngModel)]="siteName">
        <ng-template #addOnAfter><i class="anticon anticon-setting"></i></ng-template>
      </tri-input>
    </div>
  `,
  styles: []
})
export class TriDemoInputAddOnComponent implements OnInit {
  siteName = 'mysite';

  constructor() {}

  ngOnInit() {}
}
