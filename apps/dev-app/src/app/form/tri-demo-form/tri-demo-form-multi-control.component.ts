/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector       : 'tri-demo-form-multi-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <form tri-form [layout]="validateForm.controls?.formLayout?.value" [formGroup]="validateForm"
          (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label>
          <label>Form Layout</label>
        </tri-form-label>
        <tri-form-control>
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
        </tri-form-control>
      </tri-form-item>

      <tri-form-item>
        <tri-form-label>
          <label>Username</label>
        </tri-form-label>
        <tri-form-control [validateStatus]="validateForm.controls.userName">
          <input triInput formControlName="userName" [placeholder]="'Username'"/>
          <tri-form-explain
            *ngIf="validateForm.controls.userName.dirty&&validateForm.controls.userName.hasError('required')">
            Please input your username!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>

      <tri-form-item>
        <tri-form-label>
          <label>Password</label>
        </tri-form-label>
        <tri-form-control [validateStatus]="validateForm.controls.password">
          <input triInput formControlName="password" [type]="'password'" [placeholder]="'Password'" />
          <tri-form-explain
            *ngIf="validateForm.controls.password.dirty&&validateForm.controls.password.hasError('required')">
            Please input your Password!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>

      <tri-form-item>
        <tri-form-label>
          <label>Address</label>
        </tri-form-label>
        <tri-form-control [validateStatus]="validateForm.controls.address">
          <tri-row [gutter]="8">
            <input triInput tri-col [span]="12" formControlName="address" [placeholder]="'Address'" />
            <input triInput tri-col [span]="12" formControlName="country" [placeholder]="'Country'" />
          </tri-row>
          <tri-form-explain
            *ngIf="validateForm.controls.address.dirty&&validateForm.controls.address.hasError('required')">
            Please input your Address!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>

    </form>
  `
})
export class TriDemoFormMultiControlComponent {
  validateForm: FormGroup;

  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  get isHorizontal() {
    return this.validateForm.controls['formLayout'] && this.validateForm.controls['formLayout'].value === 'horizontal';
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      formLayout: ['horizontal'],
      userName  : [null, [Validators.required]],
      password  : [null, [Validators.required]],
      address   : [null, [Validators.required]],
      country   : [null, [Validators.required]]
    });
  }
}
