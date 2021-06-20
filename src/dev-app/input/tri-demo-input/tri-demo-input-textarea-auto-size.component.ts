/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title input-textarea-auot-size
 */
@Component({
  selector: 'tri-demo-input-textarea-auot-size',
  template: `
    <tri-input [(ngModel)]="inputValueOne" type="textarea" [autosize]="true"
               placeholder="Autosize height based on content lines"></tri-input>
    <div style="margin-top: 16px;">
      <tri-input [(ngModel)]="inputValueTwo" type="textarea"
                 [autosize]="autosize"
                 [minRows]="2"
                 [maxRows]="6"
                 placeholder="Autosize height with minimum and maximum number of lines"></tri-input>
    </div>
  `,
  styles  : []
})
export class TriDemoInputTextareaAutoSizeComponent implements OnInit {
  inputValueOne: string;
  inputValueTwo: string;
  autosize = true;

  constructor() {
  }

  ngOnInit() {
  }
}
