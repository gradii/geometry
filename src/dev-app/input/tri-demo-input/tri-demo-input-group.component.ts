/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title input-group
 */
@Component({
  selector: 'tri-demo-input-group',
  template: `
    <tri-input-group [size]="'large'">
      <div tri-col [span]="4">
        <input [(ngModel)]="_valueOne" [ngModelOptions]="{standalone: true}" tri-input>
      </div>
      <div tri-col [span]="8">
        <input [(ngModel)]="_valueTwo" [ngModelOptions]="{standalone: true}" tri-input>
      </div>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <input [(ngModel)]="_valueOne" [ngModelOptions]="{standalone: true}" style="width: 20%;" tri-input>
      <input [(ngModel)]="_valueTwo" [ngModelOptions]="{standalone: true}" style="width: 30%;" tri-input>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <tri-select [ngModel]="'Zhejiang'" [ngModelOptions]="{standalone: true}">
        <tri-option [label]="'Zhejiang'" [value]="'Zhejiang'"></tri-option>
        <tri-option [label]="'Jiangsu'" [value]="'Jiangsu'"></tri-option>
      </tri-select>
      <input [ngModel]="'Xihu District, Hangzhou'" [ngModelOptions]="{standalone: true}" style="width: 50%;" tri-input>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <tri-select [ngModel]="'Option1'" [ngModelOptions]="{standalone: true}">
        <tri-option [label]="'Option1'" [value]="'Option1'"></tri-option>
        <tri-option [label]="'Option2'" [value]="'Option2'"></tri-option>
      </tri-select>
      <input [ngModel]="'input content'" [ngModelOptions]="{standalone: true}" style="width: 50%;" tri-input>
      <tri-input-number [ngModel]="1" [min]="1" [max]="10" [step]="1"></tri-input-number>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <input [ngModel]="'input content'" [ngModelOptions]="{standalone: true}" style="width: 50%;" tri-input>
      <tri-date-picker [(ngModel)]="date" [ngModelOptions]="{standalone: true}"></tri-date-picker>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <tri-select [ngModel]="'Option1-1'" [ngModelOptions]="{standalone: true}">
        <tri-option [label]="'Option1-1'" [value]="'Option1-1'"></tri-option>
        <tri-option [label]="'Option1-2'" [value]="'Option1-2'"></tri-option>
      </tri-select>
      <tri-select [ngModel]="'Option2-1'" [ngModelOptions]="{standalone: true}">
        <tri-option [label]="'Option2-1'" [value]="'Option2-1'"></tri-option>
        <tri-option [label]="'Option2-2'" [value]="'Option2-2'"></tri-option>
      </tri-select>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <tri-select [ngModel]="'Between'" [ngModelOptions]="{standalone: true}">
        <tri-option [label]="'Between'" [value]="'Between'"></tri-option>
        <tri-option [label]="'Except'" [value]="'Except'"></tri-option>
      </tri-select>
      <input type="text" placeholder="Minimum" tri-input style="width: 100px; text-align: center;">
      <input type="text" placeholder="~" tri-input style="width: 24px; border-left: 0px; pointer-events: none;">
      <input type="text" placeholder="Maximum" tri-input style="width: 100px; text-align: center; margin-left: -1px;">
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <tri-select [ngModel]="'Sign Up'" [ngModelOptions]="{standalone: true}">
        <tri-option [label]="'Sign Up'" [value]="'Sign Up'"></tri-option>
        <tri-option [label]="'Sign In'" [value]="'Sign In'"></tri-option>
      </tri-select>
      <input placeholder="Email" style="width: 50%;" tri-input>
    </tri-input-group>
  `,

  styles: []
})
export class TriDemoInputGroupComponent implements OnInit {
  _valueOne = '0571';
  _valueTwo = '26888888';
  date = new Date();

  constructor() {}

  ngOnInit() {}
}
