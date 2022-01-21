/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * @title form-dynamic
 */
@Component({
  selector: 'tri-demo-form-dynamic',
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="_submitForm()">
      <tri-form-item tri-row *ngFor="let control of controlArray;let i = index">
        <tri-form-label tri-col [span]="4" *ngIf="i==0">
          <label [attr.for]="control.controlInstance">Passengers</label>
        </tri-form-label>
        <tri-form-control tri-col [span]="20" [offset]="i==0?0:4"
                          [validateStatus]="getFormControl(control.controlInstance)">
          <input triInput style="width: 60%; margin-right:8px;" [size]="'large'"
                 [placeholder]="'placeholder'" [formControlName]="control.controlInstance"
                 [id]="control.id"/>
          <i class="anticon anticon-minus-circle-o dynamic-delete-button"
             (click)="removeField(control,$event)"></i>
          <tri-form-explain
            *ngIf="getFormControl(control.controlInstance)?.dirty&&getFormControl(control.controlInstance)?.hasError('required')">
            Please input passenger's name or delete this field.
          </tri-form-explain>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-control tri-col [span]="20" [offset]="4">
          <button tri-button [type]="'dashed'" [size]="'large'" style="width:60%"
                  (click)="addField($event)">
            <i class="anticon anticon-plus"></i>
            <span> Add field</span>
          </button>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row>
        <tri-form-control tri-col [span]="20" [offset]="4">
          <button tri-button [type]="'primary'" [size]="'large'">Submit</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,

  styles: [
    `
      .dynamic-delete-button {
        cursor: pointer;
        position: relative;
        top: 4px;
        font-size: 24px;
        color: #999;
        transition: all .3s;
      }
    `
  ]
})
export class TriDemoFormDynamicComponent implements OnInit {
  validateForm: FormGroup;
  controlArray = [];

  addField(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    const id = this.controlArray.length > 0 ? this.controlArray[this.controlArray.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `passenger${id}`
    };
    const index   = this.controlArray.push(control);
    console.log(this.controlArray[this.controlArray.length - 1]);
    this.validateForm.addControl(
      this.controlArray[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
  }

  removeField(i, e: MouseEvent) {
    e.preventDefault();
    if (this.controlArray.length > 1) {
      const index = this.controlArray.indexOf(i);
      this.controlArray.splice(index, 1);
      console.log(this.controlArray);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  getFormControl(name): AbstractControl {
    return this.validateForm.controls[name];
  }

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    console.log(this.validateForm.value);
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({});
    this.addField();
  }
}
