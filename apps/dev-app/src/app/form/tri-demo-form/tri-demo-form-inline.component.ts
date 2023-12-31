/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @title form-inline
 */
@Component({
  selector: 'tri-demo-form-inline',
  template: `
    <form tri-form [layout]="'inline'" [formGroup]="validateForm" (ngSubmit)="_submitForm()">
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
              <tri-icon svgIcon="outline:lock"></tri-icon>
            </ng-template>
          </tri-input-group>
          <tri-form-explain
            *ngIf="validateForm.controls.password.dirty&&validateForm.controls.password.hasError('required')">
            Please input your Password!
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <button tri-button [type]="'primary'" [size]="'large'" [disabled]="!validateForm.valid">Log
        in
      </button>
    </form>`,

  styles: []
})
export class TriDemoFormInlineComponent implements OnInit {
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
      password: [null, [Validators.required]]
    });
  }
}
