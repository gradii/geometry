/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * @title form-mix
 */
@Component({
  selector: 'tri-demo-form-mix',
  template: `
    <form tri-form [layout]="'horizontal'" [formGroup]="validateForm">
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="6">
          <label>Plain Text</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="14">
          <span tri-form-text>China</span>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="6">
          <label tri-form-item-required>Select</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="14">
          <tri-select formControlName="select" [size]="'large'">
            <tri-option [label]="'China'" [value]="'China'"></tri-option>
            <tri-option [label]="'U.S.A'" [value]="'U.S.A'"></tri-option>
          </tri-select>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="6">
          <label tri-form-item-required>Select[multiple]</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="14">
          <tri-select formControlName="select_multiple" [size]="'large'" [mode]="'multiple'">
            <tri-option [label]="'Red'" [value]="'Red'"></tri-option>
            <tri-option [label]="'Green'" [value]="'Green'"></tri-option>
            <tri-option [label]="'Blue'" [value]="'Blue'"></tri-option>
          </tri-select>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="6">
          <label tri-form-item-required>DatePicker</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="14">
          <tri-date-picker formControlName="datepicker" [size]="'large'">
          </tri-date-picker>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="6">
          <label tri-form-item-required>TimePicker</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="14">
          <tri-time-picker formControlName="timepicker" [size]="'large'"></tri-time-picker>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="6">
          <label>InputNumber</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="14">
          <tri-input-number formControlName="input_number" [size]="'large'" [step]="1" [max]="4" [min]="1"></tri-input-number>
          <span tri-form-text> machines</span>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="6">
          <label>Switch</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="14">
          <tri-switch formControlName="switch"></tri-switch>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="6">
          <label>Slider</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="14">
          <tri-slider formControlName="slider" [marks]="marks"></tri-slider>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <div tri-form-label tri-col [span]="6">
          <label>Radio.Group</label>
        </div>
        <div tri-form-control tri-col [span]="14">
          <tri-radio-group formControlName="radio_group">
            <label tri-radio [value]="1">
              <span>item 1</span>
            </label>
            <label tri-radio [value]="2">
              <span>item 2</span>
            </label>
            <label tri-radio [value]="3">
              <span>item 3</span>
            </label>
          </tri-radio-group>
        </div>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [span]="6">
          <label>Radio.Button</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="14">
          <tri-radio-group formControlName="radio_button">
            <label tri-radio-button [value]="1">
              <span>item 1</span>
            </label>
            <label tri-radio-button [value]="2">
              <span>item 2</span>
            </label>
            <label tri-radio-button [value]="3">
              <span>item 3</span>
            </label>
          </tri-radio-group>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <div tri-form-control tri-col [span]="12" [offset]="6">
          <button tri-button [type]="'primary'" [size]="'large'">Submit</button>
        </div>
      </tri-form-item>
    </form>`,

  styles: []
})
export class TriDemoFormMixComponent implements OnInit {
  validateForm: FormGroup;

  marks = {
    0: 'A',
    25: 'B',
    50: 'C',
    75: 'D',
    100: 'E'
  };

  now = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      select: ['China'],
      select_multiple: [['Red']],
      datepicker: [new Date()],
      timepicker: [new Date()],
      input_number: [4],
      switch: [false],
      slider: [0],
      radio_group: [1],
      radio_button: [1]
    });
  }
}
