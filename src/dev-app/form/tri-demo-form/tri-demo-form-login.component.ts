/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @title form-login
 */
@Component({
  selector: 'tri-demo-form-login',
  template: `
    <form tri-form [formGroup]="validateForm" class="login-form" (ngSubmit)="_submitForm()">
      <tri-form-item>
        <tri-form-control [validateStatus]="validateForm.controls.userName">
          <tri-input-group>
            <input triInput formControlName="userName" [placeholder]="'Username'" [size]="'large'"/>
            <ng-template #prefix>
              <tri-icon svgIcon="outline:user"></tri-icon>
            </ng-template>
          </tri-input-group>
          <tri-form-explain
            *ngIf="validateForm.controls.userName.dirty&&validateForm.controls.userName.hasError('required')">
            Please input your username!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [validateStatus]="validateForm.controls.password">
          <tri-input-group>
            <input triInput formControlName="password" [type]="'password'" [placeholder]="'Password'"
                   [size]="'large'"/>
            <ng-template #prefix>
              <tri-icon svgIcon="fill:lock"></tri-icon>
            </ng-template>
          </tri-input-group>
          <tri-form-explain
            *ngIf="validateForm.controls.password.dirty&&validateForm.controls.password.hasError('required')">
            Please input your Password!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control>
          <tri-checkbox formControlName="remember">
            <span>Remember me</span>
          </tri-checkbox>
          <a class="login-form-forgot" class="login-form-forgot">Forgot password</a>
          <button tri-button class="login-form-button" [type]="'primary'" [size]="'large'">Log in
          </button>
          Or
          <a href="">register now!</a>
        </tri-form-control>
      </tri-form-item>
    </form>`,

  styles: [
    `
      .login-form {
        max-width: 300px;
      }

      .login-form-forgot {
        float: right;
      }

      .login-form-button {
        width: 100%;
      }
    `
  ]
})
export class TriDemoFormLoginComponent implements OnInit {
  validateForm: FormGroup;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
}
