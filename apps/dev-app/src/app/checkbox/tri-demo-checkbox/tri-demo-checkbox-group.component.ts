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
    <tri-checkbox-group [options]="checkOptionsOne"
                        [(ngModel)]="checkOptionsOneValue"
                        (ngModelChange)="_log($event)"></tri-checkbox-group>
    <br>
    <br>
    <tri-checkbox-group [options]="checkOptionsTwo"
                        [(ngModel)]="checkOptionsTwoValue"
                        (ngModelChange)="_log($event)"></tri-checkbox-group>
    <br>
    <br>
    <tri-checkbox-group [options]="checkOptionsThree"
                        [(ngModel)]="checkOptionsThreeValue"
                        (ngModelChange)="_log($event)"></tri-checkbox-group>
  `,
  styles  : []
})
export class TriDemoCheckboxGroupComponent implements OnInit {
  checkOptionsOneValue   = ['Apple'];
  checkOptionsTwoValue   = ['Apple'];
  checkOptionsThreeValue = ['Apple'];

  checkOptionsOne = [
    {label: 'Apple Label', value: 'Apple'},
    {label: 'Pear Label', value: 'Pear'},
    {label: 'Orange Label', value: 'Orange'}
  ];

  checkOptionsTwo   = [
    {label: 'Apple Label', value: 'Apple'},
    {label: 'Pear Label', value: 'Pear'},
    {label: 'Orange Label', value: 'Orange'}
  ];
  checkOptionsThree = [
    {label: 'Apple Label', value: 'Apple', disabled: true},
    {label: 'Pear Label', value: 'Pear', disabled: true},
    {label: 'Orange Label', value: 'Orange'}
  ];

  _log(value) {
    console.log(value);
  }

  constructor() {
  }

  ngOnInit() {
  }
}
