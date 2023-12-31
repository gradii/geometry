/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';
import { SizeLDSType } from '@gradii/triangle/core';

/**
 * @title select-size
 */
@Component({
  selector: 'tri-demo-combobox-size',
  template: `
    <tri-radio-group [(ngModel)]="size">
      <label tri-radio-button [value]="'large'"><span>Large</span></label>
      <label tri-radio-button [value]="'default'"><span>Default</span></label>
      <label tri-radio-button [value]="'small'"><span>Small</span></label>
    </tri-radio-group>
    <br>
    <br>
    <tri-combobox style="width: 200px;" [(ngModel)]="single" [size]="size">
      <tri-combobox-option
        *ngFor="let option of options"
        [label]="option.label"
        [value]="option.value"
        [disabled]="option.disabled">
      </tri-combobox-option>
    </tri-combobox>
    <br>
    <br>
    <tri-combobox style="width: 200px;" [(ngModel)]="single" [size]="size" [showSearch]="true">
      <tri-combobox-option
        *ngFor="let option of options"
        [label]="option.label"
        [value]="option.value"
        [disabled]="option.disabled">
      </tri-combobox-option>
    </tri-combobox>
    <br>
    <br>
    <tri-combobox style="width: 100%" [(ngModel)]="multiple" [size]="size" [mode]="'multiple'">
      <tri-combobox-option
        *ngFor="let option of options"
        [label]="option.label"
        [value]="option.value"
        [disabled]="option.disabled">
      </tri-combobox-option>
    </tri-combobox>
    <br>
    <br>
    <tri-combobox style="width: 100%" [(ngModel)]="tag" [size]="size" [mode]="'tags'">
      <tri-combobox-option
        *ngFor="let option of options"
        [label]="option.label"
        [value]="option.value"
        [disabled]="option.disabled">
      </tri-combobox-option>
    </tri-combobox>
  `,
  styles  : []
})
export class TriDemoComboboxSizeComponent implements OnInit {
  size: SizeLDSType = 'default';
  options           = [
    {value: 'jack', label: 'Jack'},
    {value: 'lucy', label: 'Lucy'},
    {value: 'disabled', label: 'Disabled', disabled: true}
  ];
  single            = 'lucy';
  multiple          = ['lucy'];
  tag               = ['lucy'];

  constructor() {
  }

  ngOnInit() {
  }
}
