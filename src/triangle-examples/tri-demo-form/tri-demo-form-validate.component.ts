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
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="5">
          <label>Fail</label>
        </div>
        <div tri-form-control [validateStatus]="'error'" tri-col [span]="12">
          <tri-input [ngModel]="'unavailable choice'" [size]="'large'" name="errorValid">
          </tri-input>
          <div tri-form-explain>Should be combination of numbers & alphabets</div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="5">
          <label>Warning</label>
        </div>
        <div tri-form-control [validateStatus]="'warning'" tri-col [span]="12">
          <tri-input [ngModel]="'Warning'" [size]="'large'" name="warningValid">
          </tri-input>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="5">
          <label>Validating</label>
        </div>
        <div tri-col [span]="12" tri-form-control [validateStatus]="'validating'" hasFeedback>
          <tri-input [ngModel]="'The content is being validating'" [size]="'large'" name="validating">
          </tri-input>
          <div tri-form-explain>I'm the content is being validating</div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="5">
          <label>Success</label>
        </div>
        <div tri-form-control tri-col [span]="12" [validateStatus]="'success'" hasFeedback>
          <tri-input [ngModel]="'The content'" [size]="'large'" name="successValid">
          </tri-input>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="5">
          <label>Warning</label>
        </div>
        <div tri-col [span]="12" tri-form-control [validateStatus]="'warning'" hasFeedback>
          <tri-input [ngModel]="'Warning'" [size]="'large'" name="warningHighValid">
          </tri-input>
          <div tri-form-explain>Should be combination of numbers & alphabets</div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="5">
          <label>Fail</label>
        </div>
        <div tri-col [span]="12" tri-form-control [validateStatus]="'error'" hasFeedback>
          <tri-input [ngModel]="'unavailable choice'" [size]="'large'" name="invalidValid">
          </tri-input>
          <div tri-form-explain>Should be combination of numbers & alphabets</div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="5">
          <label tri-form-item-required>inline</label>
        </div>
        <div>
          <div tri-form-control>
            <div tri-col [span]="6">
              <div tri-form-item tri-row>
                <div>
                  <div tri-form-control [validateStatus]="'error'">
                    <tri-datepicker [size]="'large'" [placeHolder]="'Select date'"></tri-datepicker>
                    <div tri-form-explain>Select date</div>
                    <div tri-form-explain>Please select the correct date</div>
                  </div>
                </div>
              </div>
            </div>
            <div tri-col [span]="1">
              <p tri-form-split>-</p>
            </div>
            <div tri-col [span]="6">
              <div tri-form-item tri-row>
                <div>
                  <div tri-form-control>
                    <tri-datepicker [size]="'large'" [placeHolder]="'Select date'"></tri-datepicker>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>`,

  styles: []
})
export class TriDemoFormValidateComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
