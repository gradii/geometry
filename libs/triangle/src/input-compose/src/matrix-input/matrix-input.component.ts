import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';


export interface MatrixInput {
  label: string;
  placeHolder: string;
  value: any;
}


@Component({
  selector: 'matrix-input',
  template: `
    <ng-template ngFor let-inputArray [ngForOf]="maxtrixInputArray" let-i="index">
      <div tri-row
           type='flex'
           [gutter]="gutter">
        <ng-template ngFor let-mInput [ngForOf]="inputArray" let-j="index">
          <tri-col [span]="_span">
            <tri-input
              [size]="'large'"
              [ngModel]="mInput.value"
              [placeHolder]="mInput.placeHolder">
            </tri-input>
          </tri-col>
        </ng-template>
        <tri-col [span]="_span">
          <i class="anticon anticon-minus-circle-o dynamic-delete-button"
             (click)="removeField(i, controlGroup, $event)"></i>
        </tri-col>
      </div>
    </ng-template>

    <div tri-form-item tri-row>
      <div tri-form-control tri-col [span]="20" [offset]="4">
        <button tri-button [type]="'dashed'" [size]="'large'" style="width:60%" (click)="addField($event)">
          <i class="anticon anticon-plus"></i>
          <span>Add field</span>
        </button>
      </div>
    </div>

  `
})
export class MatrixInputComponent implements ControlValueAccessor {


  _span;
  _spanSub;
  private _maxtrixInputArray: MatrixInput[] = [];

  @Input()
  gutter = 10;

  @Input()
  get maxtrixInputArray(): any[] {
    return this._maxtrixInputArray;
  }

  set maxtrixInputArray(value: any[]) {
    this._span              = Math.floor(24 / value.length);
    this._spanSub           = Math.round(24 % value.length);
    this._maxtrixInputArray = value;
  }

  removeField() {

  }

  addField() {

  }

  writeValue(obj: any): void {

  }

  registerOnChange(fn: any): void {

  }

  registerOnTouched(fn: any): void {

  }
}