/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title button-type
 */
@Component({
  selector: 'tri-demo-button-type',
  template: `
    <h4>href button</h4>
    <div>
      <a triButton href="//google.com">
        Link Button
      </a>
      <a triTextButton href="//google.com">
        Link Button
      </a>
    </div>

    <h4>variant</h4>
    <ng-container *ngFor="let color of colorList">
      <h5>{{color}}</h5>
      <div>
        <ng-container *ngFor="let type of typeList">
          <ng-container [ngSwitch]="type">
            <button triButton *ngSwitchCase="'fill'" [color]="color">
              {{type}} Button
            </button>
            <button triRaisedButton *ngSwitchCase="'raised'" [color]="color">
              {{type}} Button
            </button>
            <button triRoundedButton *ngSwitchCase="'rounded'" [color]="color">
              {{type}} Button
            </button>
            <button triDashedButton *ngSwitchCase="'dashed'" [color]="color">
              {{type}} Button
            </button>
            <!-- <button triDashedButton *ngSwitchCase="'rounded'" [color]="color">
               {{type}} Button
             </button>-->
            <button triTextButton *ngSwitchCase="'text'" [color]="color">
              {{type}} Button
            </button>
            <button triOutlinedButton *ngSwitchCase="'outlined'" [color]="color">
              {{type}} Button
            </button>
          </ng-container>
        </ng-container>
      </div>
    </ng-container>

    <!--    <ng-container *ngFor="let ghost of ghostTypeList">-->
    <h4>ghost</h4>
    <div style="background-color: #181818; padding: 2rem">
      <div style="background-color: rgb(36, 36, 36)">
        <ng-container *ngFor="let color of colorList">
          <h5>{{color}}</h5>
          <ng-container *ngFor="let type of ghostTypeList">
            <ng-container [ngSwitch]="type">
              <button triRoundedButton *ngSwitchCase="'rounded'" [color]="color" ghost>
                {{type}} Button
              </button>
              <button triTextButton *ngSwitchCase="'text'" [color]="color" ghost>
                {{type}} Button
              </button>
              <button triOutlinedButton *ngSwitchCase="'outlined'" [color]="color" ghost>
                {{type}} Button
              </button>
              <button triDashedButton *ngSwitchCase="'dashed'" [color]="color" ghost>
                {{type}} Button
              </button>
            </ng-container>
          </ng-container>
        </ng-container>
      </div>
    </div>
    <!--    </ng-container>-->

  `,
  styles  : [
    `.tri-btn + .tri-btn {
      margin-left : 1rem;
    }`
  ]
})
export class TriDemoButtonTypeComponent implements OnInit {
  typeList  = ['fill', 'raised', 'rounded', 'dashed', 'text', 'outlined'];
  colorList = [
    'default',
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'error'
  ];

  ghostTypeList = [
    'outlined',
    'rounded',
    'dashed',
    'text'
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
