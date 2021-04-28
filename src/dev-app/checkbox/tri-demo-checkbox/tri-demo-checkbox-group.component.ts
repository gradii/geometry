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
 * @title checkbox-group
 */
@Component({
  selector: 'tri-demo-checkbox-group',
  template: `
    <tri-checkbox-group [(ngModel)]="checkOptionsOne" (ngModelChange)="_log(checkOptionsOne)"></tri-checkbox-group>
    <br>
    <br>
    <tri-checkbox-group [(ngModel)]="checkOptionsTwo" (ngModelChange)="_log(checkOptionsTwo)"></tri-checkbox-group>
    <br>
    <br>
    <tri-checkbox-group [(ngModel)]="checkOptionsThree" (ngModelChange)="_log(checkOptionsThree)"></tri-checkbox-group>
  `,
  styles  : []
})
export class TriDemoCheckboxGroupComponent implements OnInit {
  checkOptionsOne   = [
    {label: 'Apple', value: 'Apple', checked: true},
    {label: 'Pear', value: 'Pear'},
    {label: 'Orange', value: 'Orange'}
  ];
  checkOptionsTwo   = [
    {label: 'Apple', value: 'Apple'},
    {label: 'Pear', value: 'Pear', checked: true},
    {label: 'Orange', value: 'Orange'}
  ];
  checkOptionsThree = [
    {label: 'Apple', value: 'Apple', disabled: true, checked: true},
    {label: 'Pear', value: 'Pear', disabled: true},
    {label: 'Orange', value: 'Orange'}
  ];

  _log(value) {
    console.log(value);
  }

  constructor() {
  }

  ngOnInit() {
  }
}
