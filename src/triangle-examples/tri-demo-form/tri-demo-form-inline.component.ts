import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @title form-inline
 */
@Component({
  selector: 'tri-demo-form-inline',
  template: `
    <form tri-form [layout]="'inline'" [formGroup]="validateForm" (ngSubmit)="_submitForm()">
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
      <button tri-button [type]="'primary'" [size]="'large'" [disabled]="!validateForm.valid">Log in</button>
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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}
