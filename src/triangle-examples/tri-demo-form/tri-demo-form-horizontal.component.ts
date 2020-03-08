/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

/**
 * @title form-horizontal
 */
@Component({
  selector: 'tri-demo-form-horizontal',
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="_submitForm()">
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="email" tri-form-item-required>E-mail</label>
        </div>
        <div tri-form-control tri-col [sm]="14" [xs]="24" hasFeedback [validateStatus]="getFormControl('email')">
          <tri-input [size]="'large'" formControlName="email" [id]="'email'"></tri-input>
          <div tri-form-explain *ngIf="getFormControl('email').dirty&&getFormControl('email').hasError('email')">The
            input is not valid E-mail!
          </div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="password" tri-form-item-required>Password</label>
        </div>
        <div tri-form-control tri-col [sm]="14" [xs]="24" hasFeedback [validateStatus]="getFormControl('password')">
          <tri-input [size]="'large'" formControlName="password" [type]="'password'" [id]="'password'"
                     (ngModelChange)="updateConfirmValidator()"></tri-input>
          <div tri-form-explain
               *ngIf="getFormControl('password').dirty&&getFormControl('password').hasError('required')">Please input
            your password!
          </div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="checkPassword" tri-form-item-required>Confirm Password</label>
        </div>
        <div tri-form-control tri-col [sm]="14" [xs]="24" hasFeedback
             [validateStatus]="getFormControl('checkPassword')">
          <tri-input [size]="'large'" formControlName="checkPassword" [type]="'password'"
                     [id]="'checkPassword'"></tri-input>
          <div tri-form-explain
               *ngIf="getFormControl('checkPassword').dirty&&getFormControl('checkPassword').hasError('required')">
            Please confirm your password!
          </div>
          <div tri-form-explain
               *ngIf="getFormControl('checkPassword').dirty&&getFormControl('checkPassword').hasError('confirm')">
            Two passwords that you enter is inconsistent!
          </div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="nickname" tri-form-item-required>
            <span>
              Nickname
              <tri-tooltip [title]="'What do you want other to call you'">
                <i tri-tooltip class="anticon anticon-question-circle-o"></i>
              </tri-tooltip>
            </span>
          </label>
        </div>
        <div tri-form-control tri-col [sm]="14" [xs]="24" hasFeedback [validateStatus]="getFormControl('nickname')">
          <tri-input [size]="'large'" formControlName="nickname" [id]="'nickname'"></tri-input>
          <div tri-form-explain
               *ngIf="getFormControl('nickname').dirty&&getFormControl('nickname').hasError('required')">Please input
            your nickname!
          </div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="phoneNumber" tri-form-item-required>Phone Number</label>
        </div>
        <div tri-form-control tri-col [sm]="14" [xs]="24" hasFeedback [validateStatus]="getFormControl('phoneNumber')">
          <tri-input-group [size]="'large'" [compact]="true">
            <tri-select formControlName="phoneNumberPrefix" style="width: 25%;">
              <tri-option [label]="'+86'" [value]="'+86'"></tri-option>
              <tri-option [label]="'+87'" [value]="'+87'"></tri-option>
            </tri-select>
            <input formControlName="phoneNumber" id="'phoneNumber'" tri-input style="width: 75%;">
          </tri-input-group>
          <div tri-form-explain
               *ngIf="getFormControl('phoneNumber').dirty&&getFormControl('phoneNumber').hasError('required')">Please
            input your phone number!
          </div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="website" tri-form-item-required>Website</label>
        </div>
        <div tri-form-control tri-col [sm]="14" [xs]="24" hasFeedback [validateStatus]="getFormControl('website')">
          <tri-input [size]="'large'" formControlName="website" [id]="'website'"></tri-input>
          <div tri-form-explain *ngIf="getFormControl('website').dirty&&getFormControl('website').hasError('required')">
            Please input website!
          </div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="captcha" tri-form-item-required>Captcha</label>
        </div>
        <div tri-form-control tri-col [sm]="14" [xs]="24" [validateStatus]="getFormControl('captcha')">
          <div tri-row [gutter]="8">
            <div tri-col [span]="12">
              <tri-input [size]="'large'" formControlName="captcha" [id]="'captcha'"></tri-input>
            </div>
            <div tri-col [span]="12">
              <button tri-button [size]="'large'" (click)="getCaptcha($event)">Get captcha</button>
            </div>
          </div>
          <div tri-form-extra>We must make sure that your are a human.</div>
          <div tri-form-explain *ngIf="getFormControl('captcha').dirty&&getFormControl('captcha').hasError('required')">
            Please input the captcha you got!
          </div>
        </div>
      </div>
      <div tri-form-item tri-row style="margin-bottom:8px;">
        <div tri-form-control tri-col [span]="14" [offset]="6">
          <tri-checkbox formControlName="agree">
            <span>I have read the <a>agreement</a></span>
          </tri-checkbox>
        </div>
      </div>
      <div tri-form-item tri-row style="margin-bottom:8px;">
        <div tri-form-control tri-col [span]="14" [offset]="6">
          <button tri-button [size]="'large'" [type]="'primary'">Register</button>
        </div>
      </div>
    </form>`,

  styles: []
})
export class TriDemoFormHorizontalComponent implements OnInit {
  validateForm: FormGroup;

  _submitForm() {
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  constructor(private fb: FormBuilder) {}

  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(_ => {
      this.validateForm.controls['checkPassword'].updateValueAndValidity();
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
  };

  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+86'],
      phoneNumber: [null, [Validators.required]],
      website: [null, [Validators.required]],
      captcha: [null, [Validators.required]],
      agree: [false]
    });
  }

  getFormControl(name): AbstractControl {
    return this.validateForm.controls[name];
  }
}
