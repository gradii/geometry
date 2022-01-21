/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { ButtonColor, ButtonVariant } from '@gradii/triangle/button';

/**
 * @title button-type
 */
@Component({
  selector: 'tri-demo-button-type',
  template: `
    <h4>default button</h4>
    <button triButton>
      default button
    </button>
    <h4>href button</h4>
    <div>
      <a triButton href="//google.com">
        Link button
      </a>
      <a triTextButton href="//google.com">
        Link button
      </a>
    </div>

    <h4>variant</h4>
    <ng-container *ngFor="let color of colorList">
      <h5>{{color}}</h5>
      <div>
        <ng-container *ngFor="let type of typeList">
            <button triButton [variant]="type" [color]="color">
              {{type}} button
            </button>
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
              <button triButton [variant]="type" [color]="color" ghost>
                {{type}} button
              </button>
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
  colorList: ButtonColor[] = [
    'default',
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger'
  ];

  ghostTypeList: ButtonVariant[] = [
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
