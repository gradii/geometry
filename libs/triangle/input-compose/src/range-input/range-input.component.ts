import { isArray, isPresent, loop } from '@gradii/triangle/util';
import { Component, forwardRef, Input, TrackByFunction } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector : 'tri-range-input',
  template : `
    <ng-template ngFor let-val [ngForOf]="values" [ngForTrackBy]="trackByFn" let-i="index">
      <div tri-form-item>
        <input tri-input
               style="width: calc(100% - 20px)"
               [size]="'large'"
               [ngModel]="val"
               (ngModelChange)="onModelChange(i, $event)"
               [attr.placeHolder]="placeholder"/>
        <i *ngIf="values?.length > 1" class="anticon anticon-minus-circle-o dynamic-delete-button"
           (click)="removeField(i, $event)"></i>
      </div>
    </ng-template>

    <div tri-form-item>
      <div tri-form-control>
        <button tri-button [type]="'dashed'" [size]="'large'" (click)="addField($event)">
          <i *ngIf="addIcon" class="anticon {{addIcon}}"></i>
          <span>{{addLabel}}</span>
        </button>
      </div>
    </div>
  `,
  styles   : [
      `.dynamic-delete-button {
      cursor     : pointer;
      font-size  : 16px;
      color      : #999;
      margin     : auto;
      transition : all .3s;
    }`
  ],
  providers: [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeInputComponent),
      multi      : true
    }
  ]
})
export class RangeInputComponent implements ControlValueAccessor {
  private _onChange: Function = loop;
  private _onTouch: Function = loop;

  @Input() placeholder: string;
  @Input() values: any[] = [null];

  @Input() addIcon: string = 'anticon-plus';
  @Input() addLabel: string = 'Add';

  public get trackByFn(): TrackByFunction<number> {
    return (index, item) => {
      return index;
    };
  }

  constructor() {
  }

  addField(event) {
    this.values.push(null);
  }

  removeField(index, event) {
    this.values.splice(index, 1);
    this._onTouch();
    this._onChange(this.values);
  }

  onModelChange(i, $event) {
    this.values[i] = $event;
    this._onTouch();
    this._onChange(this.values);
  }

  writeValue(value: any[]): void {
    if (isArray(value)) {
      this.values = value;
    } else if (isPresent(value)) {
      this.values = [value];
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }
}
