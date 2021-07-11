/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * @title form-horizontal
 */
@Component({
  selector: 'tri-demo-form-horizontal',
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="_submitForm()">
      <tri-form-item tri-row>
        <tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="email" tri-form-item-required>E-mail</label>
        </tri-form-label>
        <tri-form-control tri-col [sm]="14" [xs]="24" [hasFeedback]="true"
                          [validateStatus]="getFormControl('email')">
          <input triInput [size]="'large'" formControlName="email" [id]="'email'"/>
          <tri-form-explain
            *ngIf="getFormControl('email').dirty&&getFormControl('email').hasError('email')">The
            input is not valid E-mail!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="password" tri-form-item-required>Password</label>
        </tri-form-label>
        <tri-form-control tri-col [sm]="14" [xs]="24" [hasFeedback]="true"
                          [validateStatus]="getFormControl('password')">
          <input triInput [size]="'large'" formControlName="password" [type]="'password'"
                 [id]="'password'" (ngModelChange)="updateConfirmValidator()"/>
          <tri-form-explain
            *ngIf="getFormControl('password').dirty&&getFormControl('password').hasError('required')">
            Please input
            your password!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="checkPassword" tri-form-item-required>Confirm Password</label>
        </tri-form-label>
        <tri-form-control tri-col [sm]="14" [xs]="24" [hasFeedback]="true"
                          [validateStatus]="getFormControl('checkPassword')">
          <input triInput [size]="'large'" formControlName="checkPassword" [type]="'password'"
                 [id]="'checkPassword'"/>
          <tri-form-explain
            *ngIf="getFormControl('checkPassword').dirty&&getFormControl('checkPassword').hasError('required')">
            Please confirm your password!
          </tri-form-explain>
          <tri-form-explain
            *ngIf="getFormControl('checkPassword').dirty&&getFormControl('checkPassword').hasError('confirm')">
            Two passwords that you enter is inconsistent!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="nickname" tri-form-item-required>
            <span>
              Nickname
                <i triTooltip="What do you want other to call you"
                   class="anticon anticon-question-circle-o"></i>
            </span>
          </label>
        </tri-form-label>
        <tri-form-control tri-col [sm]="14" [xs]="24" [hasFeedback]="true"
                          [validateStatus]="getFormControl('nickname')">
          <input triInput [size]="'large'" formControlName="nickname" [id]="'nickname'"/>
          <tri-form-explain
            *ngIf="getFormControl('nickname').dirty&&getFormControl('nickname').hasError('required')">
            Please input
            your nickname!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="phoneNumber" tri-form-item-required>Phone Number</label>
        </tri-form-label>
        <tri-form-control tri-col [sm]="14" [xs]="24" [hasFeedback]="true"
                          [validateStatus]="getFormControl('phoneNumber')">
          <tri-input-group [size]="'large'">
            <tri-select formControlName="phoneNumberPrefix" size="large" style="width: 25%;">
              <tri-option [label]="'+86'" [value]="'+86'"></tri-option>
              <tri-option [label]="'+87'" [value]="'+87'"></tri-option>
            </tri-select>
            <input triInput formControlName="phoneNumber" size="large" id="'phoneNumber'" style="width: 75%;">
          </tri-input-group>
          <tri-form-explain
            *ngIf="getFormControl('phoneNumber').dirty&&getFormControl('phoneNumber').hasError('required')">
            Please
            input your phone number!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="website" tri-form-item-required>Website</label>
        </tri-form-label>
        <tri-form-control tri-col [sm]="14" [xs]="24" [hasFeedback]="true"
                          [validateStatus]="getFormControl('website')">
          <input triInput [size]="'large'" formControlName="website" [id]="'website'"/>
          <tri-form-explain
            *ngIf="getFormControl('website').dirty&&getFormControl('website').hasError('required')">
            Please input website!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-label tri-col [sm]="6" [xs]="24">
          <label for="captcha" tri-form-item-required>Captcha</label>
        </tri-form-label>
        <tri-form-control tri-col [sm]="14" [xs]="24" [validateStatus]="getFormControl('captcha')">
          <div tri-row [gutter]="8">
            <div tri-col [span]="12">
              <input triInput [size]="'large'" formControlName="captcha" [id]="'captcha'"/>
            </div>
            <div tri-col [span]="12">
              <button tri-button [size]="'large'" (click)="getCaptcha($event)">Get captcha</button>
            </div>
          </div>
          <tri-form-extra>We must make sure that your are a human.</tri-form-extra>
          <tri-form-explain
            *ngIf="getFormControl('captcha').dirty&&getFormControl('captcha').hasError('required')">
            Please input the captcha you got!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row style="margin-bottom:8px;">
        <tri-form-control tri-col [span]="14" [offset]="6">
          <tri-checkbox formControlName="agree">
            <span>I have read the <a>agreement</a></span>
          </tri-checkbox>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row style="margin-bottom:8px;">
        <tri-form-control tri-col [span]="14" [offset]="6">
          <button tri-button [size]="'large'" [type]="'primary'">Register</button>
        </tri-form-control>
      </tri-form-item>
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

  constructor(private fb: FormBuilder) {
  }

  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(_ => {
      this.validateForm.controls['checkPassword'].updateValueAndValidity();
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return {confirm: true, error: true};
    }
  };

  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      email            : [null, [Validators.email]],
      password         : [null, [Validators.required]],
      checkPassword    : [null, [Validators.required, this.confirmationValidator]],
      nickname         : [null, [Validators.required]],
      phoneNumberPrefix: ['+86'],
      phoneNumber      : [null, [Validators.required]],
      website          : [null, [Validators.required]],
      captcha          : [null, [Validators.required]],
      agree            : [false]
    });
  }

  getFormControl(name): AbstractControl {
    return this.validateForm.controls[name];
  }
}
