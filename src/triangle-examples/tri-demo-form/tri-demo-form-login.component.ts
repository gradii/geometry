import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @title form-login
 */
@Component({
  selector: 'tri-demo-form-login',
  template: `
              <form tri-form [formGroup]="validateForm" class="login-form" (ngSubmit)="_submitForm()">
                <div tri-form-item>
                  <div tri-form-control [validateStatus]="validateForm.controls.userName">
                    <tri-input formControlName="userName" [placeHolder]="'Username'" [size]="'large'">
                      <ng-template #prefix>
                        <i class="anticon anticon-user"></i>
                      </ng-template>
                    </tri-input>
                    <div tri-form-explain *ngIf="validateForm.controls.userName.dirty&&validateForm.controls.userName.hasError('required')">Please input your username!</div>
                  </div>
                </div>
                <div tri-form-item>
                  <div tri-form-control [validateStatus]="validateForm.controls.password">
                    <tri-input formControlName="password" [type]="'password'" [placeHolder]="'Password'" [size]="'large'">
                      <ng-template #prefix>
                        <i class="anticon anticon-lock"></i>
                      </ng-template>
                    </tri-input>
                    <div tri-form-explain *ngIf="validateForm.controls.password.dirty&&validateForm.controls.password.hasError('required')">Please input your Password!</div>
                  </div>
                </div>
                <div tri-form-item>
                  <div tri-form-control>
                    <tri-checkbox formControlName="remember">
                      <span>Remember me</span>
                    </tri-checkbox>
                    <a class="login-form-forgot" class="login-form-forgot">Forgot password</a>
                    <button tri-button class="login-form-button" [type]="'primary'" [size]="'large'">Log in</button>
                    Or
                    <a href="">register now!</a>
                  </div>
                </div>
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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
}
