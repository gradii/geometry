/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * @title form-validate-dynamic
 */
@Component({
  selector: 'tri-demo-form-validate-dynamic',
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm($event,validateForm.value)">
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="7">
          <label tri-form-item-required>Username</label>
        </div>
        <div tri-col [span]="12" tri-form-control [validateStatus]="getFormControl('userName')" [hasFeedback]="true">
          <tri-input formControlName="userName" [type]="'text'" [placeholder]="'async validate try to write JasonWood'" [size]="'large'">
          </tri-input>
          <tri-form-explain *ngIf="getFormControl('userName').dirty&&getFormControl('userName').hasError('required')">Please input your username!</tri-form-explain>
          <tri-form-explain *ngIf="getFormControl('userName').dirty&&getFormControl('userName').hasError('duplicated')">The username is redundant!</tri-form-explain>
          <tri-form-explain *ngIf="getFormControl('userName').dirty&&getFormControl('userName').pending">Validating...</tri-form-explain>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="7">
          <label tri-form-item-required>E-mail</label>
        </div>
        <div tri-col [span]="12" tri-form-control [validateStatus]="getFormControl('email')" [hasFeedback]="true">
          <tri-input formControlName="email" [placeholder]="'email'" [type]="'email'" [size]="'large'">
          </tri-input>
          <tri-form-explain *ngIf="getFormControl('email').dirty&&getFormControl('email').hasError('email')">The input is not valid E-mail!</tri-form-explain>
          <tri-form-explain *ngIf="getFormControl('email').dirty&&getFormControl('email').hasError('required')">Please input your E-mail!</tri-form-explain>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-form-label tri-col [span]="7">
          <label tri-form-item-required>BirthDay</label>
        </div>
        <div tri-col [span]="12" tri-form-control [validateStatus]="getFormControl('birthDay')">
          <tri-date-picker formControlName="birthDay" [size]="'large'" [placeholder]="'Choose your birthday'" ></tri-date-picker>
          <tri-form-explain *ngIf="getFormControl('birthDay').dirty&&getFormControl('birthDay').hasError('required')">Please input your birthday!</tri-form-explain>
          <tri-form-explain *ngIf="getFormControl('birthDay').dirty&&getFormControl('birthDay').hasError('expired')">Birthday must less than today!</tri-form-explain>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-col [span]="7" tri-form-label>
          <label tri-form-item-required>Password</label>
        </div>
        <div>
          <div tri-col [span]="12" tri-form-control [validateStatus]="getFormControl('password')" [hasFeedback]="true">
            <tri-input formControlName="password" [placeholder]="'password'" [type]="'password'" [size]="'large'" (ngModelChange)="validateConfirmPassword()">
            </tri-input>
            <tri-form-explain *ngIf="getFormControl('password').dirty&&getFormControl('password').hasError('required')">Please input your password!</tri-form-explain>
          </div>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-col [span]="7" tri-form-label>
          <label tri-form-item-required>Confirm Password</label>
        </div>
        <div tri-col [span]="12" tri-form-control [validateStatus]="getFormControl('passwordConfirmation')" [hasFeedback]="true">
          <tri-input formControlName="passwordConfirmation" [type]="'password'" [placeholder]="'confirm your password'" [size]="'large'">
          </tri-input>
          <tri-form-explain *ngIf="getFormControl('passwordConfirmation').dirty&&getFormControl('passwordConfirmation').hasError('required')">Please confirm your password!</tri-form-explain>
          <tri-form-explain *ngIf="getFormControl('passwordConfirmation').dirty&&getFormControl('passwordConfirmation').hasError('confirm')">Two passwords that you enter is inconsistent!</tri-form-explain>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-col [span]="7" tri-form-label>
          <label tri-form-item-required>Comment</label>
        </div>
        <div tri-col [span]="12" tri-form-control [validateStatus]="getFormControl('comment')">
          <tri-input formControlName="comment" [rows]="2" [type]="'textarea'" [placeholder]="'write any thing'" [size]="'large'">
          </tri-input>
          <tri-form-explain *ngIf="getFormControl('comment').dirty&&getFormControl('comment').hasError('required')">Please write something here!</tri-form-explain>
        </div>
      </div>
      <div tri-form-item tri-row>
        <div tri-col [offset]="7" [span]="12" tri-form-control>
          <button tri-button [type]="'primary'" [size]="'large'" [disabled]="!validateForm.valid">Submit</button>
          <button tri-button [size]="'large'" (click)="resetForm($event)">Reset</button>
        </div>
      </div>
    </form>`,

  styles: []
})
export class TriDemoFormValidateDynamicComponent implements OnInit {
  validateForm: FormGroup;
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
    }
    console.log(value);
  };

  resetForm($event: MouseEvent) {
    $event.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
    }
  }

  validateConfirmPassword() {
    setTimeout(_ => {
      this.validateForm.controls['passwordConfirmation'].updateValueAndValidity();
    });
  }

  userNameAsyncValidator = (control: FormControl): any => {
    return Observable.create(function(observer) {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
  };

  getFormControl(name): AbstractControl {
    return this.validateForm.controls[name];
  }

  emailValidator = (control: FormControl): { [s: string]: boolean } => {
    const EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!control.value) {
      return { required: true };
    } else if (!EMAIL_REGEXP.test(control.value)) {
      return { error: true, email: true };
    }
  };
  passwordConfirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
  };
  birthDayValidator = (control: FormControl): any => {
    if (new Date(control.value) > new Date()) {
      return { expired: true, error: true };
    }
  };

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required], [this.userNameAsyncValidator]],
      email: ['', [this.emailValidator]],
      birthDay: ['', [this.birthDayValidator]],
      password: ['', [Validators.required]],
      passwordConfirmation: ['', [this.passwordConfirmationValidator]],
      comment: ['', [Validators.required]]
    });
  }

  ngOnInit() {}
}
