/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @title form-layout
 */
@Component({
  selector: 'tri-demo-form-layout',
  template: `
    <form tri-form [layout]="validateForm.controls?.formLayout?.value" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="isHorizontal?4:false">
          <label>Form Layout</label>
        </div>
        <div tri-form-control tri-col [span]="isHorizontal?14:false">
          <tri-radio-group formControlName="formLayout">
            <label tri-radio-button [value]="'horizontal'">
              <span>Horizontal</span>
            </label>
            <label tri-radio-button [value]="'vertical'">
              <span>Vertical</span>
            </label>
            <label tri-radio-button [value]="'inline'">
              <span>Inline</span>
            </label>
          </tri-radio-group>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="isHorizontal?4:false">
          <label>Username</label>
        </div>
        <div tri-form-control tri-col [span]="isHorizontal?14:false" [validateStatus]="validateForm.controls.userName">
          <tri-input formControlName="userName" [placeHolder]="'Username'" [size]="'large'">
          </tri-input>
          <div tri-form-explain *ngIf="validateForm.controls.userName.dirty&&validateForm.controls.userName.hasError('required')">Please input your username!</div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="isHorizontal?4:false">
          <label>Password</label>
        </div>
        <div tri-form-control tri-col [span]="isHorizontal?14:false" [validateStatus]="validateForm.controls.password">
          <tri-input formControlName="password" [type]="'password'" [placeHolder]="'Password'" [size]="'large'">
          </tri-input>
          <div tri-form-explain *ngIf="validateForm.controls.password.dirty&&validateForm.controls.password.hasError('required')">Please input your Password!</div>
        </div>
      </div>
    </form>`,

  styles: []
})
export class TriDemoFormLayoutComponent implements OnInit {
  validateForm: FormGroup;

  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  get isHorizontal() {
    return this.validateForm.controls['formLayout'] && this.validateForm.controls['formLayout'].value === 'horizontal';
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      formLayout: ['horizontal'],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}
