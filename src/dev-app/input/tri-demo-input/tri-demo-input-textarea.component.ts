/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title input-textarea
 */
@Component({
  selector: 'tri-demo-input-textarea',
  template: `
    <tri-input [(ngModel)]="inputValue"
               [type]="'textarea'" [rows]="4"
               [placeholder]="''"></tri-input>`,
  styles  : []
})
export class TriDemoInputTextareaComponent implements OnInit {
  inputValue: string;

  constructor() {
  }

  ngOnInit() {
  }
}
