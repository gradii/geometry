/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title form-validate
 */
@Component({
  selector: 'tri-demo-form-validate',
  template: `
    <form tri-form [layout]="'horizontal'">
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="5">
          <label>Fail</label>
        </tri-form-label>
        <tri-form-control [validateStatus]="'error'" tri-col [span]="12">
          <tri-input [ngModel]="'unavailable choice'" [size]="'large'" name="errorValid">
          </tri-input>
          <tri-form-explain>Should be combination of numbers & alphabets</tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="5">
          <label>Warning</label>
        </tri-form-label>
        <tri-form-control [validateStatus]="'warning'" tri-col [span]="12">
          <tri-input [ngModel]="'Warning'" [size]="'large'" name="warningValid">
          </tri-input>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="5">
          <label>Validating</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="12" [validateStatus]="'validating'" [hasFeedback]="true">
          <tri-input [ngModel]="'The content is being validating'" [size]="'large'"
                     name="validating">
          </tri-input>
          <tri-form-explain>I'm the content is being validating</tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="5">
          <label>Success</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="12" [validateStatus]="'success'" [hasFeedback]="true">
          <tri-input [ngModel]="'The content'" [size]="'large'" name="successValid">
          </tri-input>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="5">
          <label>Warning</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="12" [validateStatus]="'warning'" [hasFeedback]="true">
          <tri-input [ngModel]="'Warning'" [size]="'large'" name="warningHighValid">
          </tri-input>
          <tri-form-explain>Should be combination of numbers & alphabets</tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="5">
          <label>Fail</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="12" [validateStatus]="'error'" [hasFeedback]="true">
          <tri-input [ngModel]="'unavailable choice'" [size]="'large'" name="invalidValid">
          </tri-input>
          <tri-form-explain>Should be combination of numbers & alphabets</tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="5">
          <label tri-form-item-required>inline</label>
        </tri-form-label>
        <div>
          <tri-form-control>
            <div tri-col [span]="6">
              <tri-form-item tri-row>
                <tri-form-control [validateStatus]="'error'">
                  <tri-date-picker [size]="'large'" [placeholder]="'Select date'"></tri-date-picker>
                  <tri-form-explain>Select date</tri-form-explain>
                  <tri-form-explain>Please select the correct date</tri-form-explain>
                </tri-form-control>
              </tri-form-item>
            </div>
            <div tri-col [span]="1">
              <p tri-form-split>-</p>
            </div>
            <div tri-col [span]="6">
              <tri-form-item tri-row>
                <tri-form-control>
                  <tri-date-picker [size]="'large'" [placeholder]="'Select date'"></tri-date-picker>
                </tri-form-control>
              </tri-form-item>
            </div>
          </tri-form-control>
        </div>
      </tri-form-item>
    </form>`,

  styles: []
})
export class TriDemoFormValidateComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
