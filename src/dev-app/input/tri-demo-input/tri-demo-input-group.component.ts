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
      <tri-row gap="8">
        <div tri-col [span]="4">
          <input [(ngModel)]="_valueOne" [ngModelOptions]="{standalone: true}" tri-input>
        </div>
        <div tri-col [span]="8">
          <input [(ngModel)]="_valueTwo" [ngModelOptions]="{standalone: true}" tri-input>
        </div>
      </tri-row>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <input [(ngModel)]="_valueOne" [ngModelOptions]="{standalone: true}" style="width: 20%;"
             tri-input>
      <input [(ngModel)]="_valueTwo" [ngModelOptions]="{standalone: true}" style="width: 30%;"
             tri-input>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <tri-select [ngModel]="'Zhejiang'" [ngModelOptions]="{standalone: true}">
        <tri-option [value]="'Zhejiang'">Zhejiang</tri-option>
        <tri-option [value]="'Jiangsu'">Jiangsu</tri-option>
      </tri-select>
      <input [ngModel]="'Xihu District, Hangzhou'" [ngModelOptions]="{standalone: true}"
             style="width: 50%;" tri-input>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <tri-select [ngModel]="'Option1'" [ngModelOptions]="{standalone: true}">
        <tri-option [value]="'Option1'">Option1</tri-option>
        <tri-option [value]="'Option2'">Option2</tri-option>
      </tri-select>
      <input [ngModel]="'input content'" [ngModelOptions]="{standalone: true}" style="width: 50%;"
             tri-input>
      <tri-input-number [ngModel]="1" [min]="1" [max]="10" [step]="1"></tri-input-number>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <input [ngModel]="'input content'" [ngModelOptions]="{standalone: true}" style="width: 50%;"
             tri-input>
      <tri-date-picker [(ngModel)]="date" [ngModelOptions]="{standalone: true}"></tri-date-picker>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <tri-select [ngModel]="'Option1-1'" [ngModelOptions]="{standalone: true}">
        <tri-option [value]="'Option1-1'">Option1-1</tri-option>
        <tri-option [value]="'Option1-2'">Option1-2</tri-option>
      </tri-select>
      <tri-select [ngModel]="'Option2-1'" [ngModelOptions]="{standalone: true}">
        <tri-option [value]="'Option2-1'">Option2-1</tri-option>
        <tri-option [value]="'Option2-2'">Option2-2</tri-option>
      </tri-select>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <tri-select [ngModel]="'Between'" [ngModelOptions]="{standalone: true}">
        <tri-option [value]="'Between'">Between</tri-option>
        <tri-option [value]="'Except'">Except</tri-option>
      </tri-select>
      <input type="text" placeholder="Minimum" tri-input style="width: 100px; text-align: center;">
      <input type="text" placeholder="~" tri-input style="
      width: 24px;border-left: 0;border-right: 0;
      pointer-events: none;margin-right: -1px;z-index: 2;">
      <input type="text" placeholder="Maximum" tri-input
             style="width: 100px; text-align: center; margin-left: -1px;">
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <input type="text" placeholder="Minimum" tri-input style="width: 100px;">
      <button triButton>Save</button>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <input type="text" placeholder="Minimum" tri-input style="width: 100px;">
      <button triButton>Save</button>
      <button triButton>Dropdown</button>
    </tri-input-group>
    <br>
    <tri-input-group [size]="'large'">
      <tri-select [ngModel]="'Sign Up'" [ngModelOptions]="{standalone: true}">
        <tri-option [value]="'Sign Up'">Sign Up</tri-option>
        <tri-option [value]="'Sign In'">Sign In</tri-option>
      </tri-select>
      <input placeholder="Email" style="width: 50%;" tri-input>
    </tri-input-group>
  `,

  styles: []
})
export class TriDemoInputGroupComponent implements OnInit {
  _valueOne = 'xxxx';
  _valueTwo = 'xxxxxxxx';
  date      = new Date();

  constructor() {
  }

  ngOnInit() {
  }
}
