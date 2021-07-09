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
    <textarea triTextarea triTextareaAutosize [(ngModel)]="inputValueOne" type="textarea"
               placeholder="Autosize height based on content lines"></textarea>
    <div style="margin-top: 16px;">
      <textarea triTextarea [triTextareaAutosize]="autosize" [(ngModel)]="inputValueTwo" type="textarea"
                 [triAutosizeMinRows]="2"
                 [triAutosizeMaxRows]="6"
                 placeholder="Autosize height with minimum and maximum number of lines"></textarea>
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
