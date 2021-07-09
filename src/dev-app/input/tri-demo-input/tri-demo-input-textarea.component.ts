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
    <textarea triTextarea [(ngModel)]="inputValue"
               [rows]="4"
               [placeholder]="''"></textarea>`,
  styles  : []
})
export class TriDemoInputTextareaComponent implements OnInit {
  inputValue: string;

  constructor() {
  }

  ngOnInit() {
  }
}
