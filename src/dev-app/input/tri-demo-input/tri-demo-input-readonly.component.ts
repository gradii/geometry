/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title input-basic
 */
@Component({
  selector: 'tri-demo-input-basic',
  template: `
    <tri-input
      [readonly]="true"
      [(ngModel)]="inputValue"
      [placeholder]="'Basic usage'"
      (ngModelChange)="_console($event)"></tri-input>
    <input tri-input [(ngModel)]="inputValue"/>
    <p>{{inputValue}}</p>`,

  styles: []
})
export class TriDemoInputReadonlyComponent implements OnInit {
  inputValue: string;

  _console(value) {
    console.log(value);
  }

  constructor() {
  }

  ngOnInit() {
  }
}
