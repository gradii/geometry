/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

/**
 * @title form-advanced
 */
@Component({
  selector: 'tri-demo-form-advanced',
  template: `
    <form tri-form [formGroup]="validateForm" class="ant-advanced-search-form">
      <div tri-row [gutter]="40">
        <div tri-col [span]="8" *ngFor="let control of controlArray"
             [style.display]="control.show?'block':'none'">
          <tri-form-item tri-row>
            <tri-form-label tri-col [span]="5">
              <label [attr.for]="'field'+control.index">Field {{control.index}}</label>
            </tri-form-label>
            <tri-form-control tri-col [span]="19">
              <input triInput [size]="'large'" [placeholder]="'placeholder'"
                     [formControlName]="'field'+control.index"
                     [id]="'field'+control.index"/>
            </tri-form-control>
          </tri-form-item>
        </div>
      </div>
      <div tri-row>
        <div tri-col [span]="24" style="text-align: right;">
          <button tri-button [type]="'primary'">Search</button>
          <button tri-button (click)="resetForm()">Clear</button>
          <a style="margin-left:8px;font-size:12px;" (click)="toggleCollapse()">
            Collapse
            <i class="anticon" [class.triicon-down]="isCollapse"
               [class.triicon-up]="!isCollapse"></i>
          </a>
        </div>
      </div>
    </form>
    <div class="search-result-list">
      Search Result List
    </div>
  `,

  styles: [
    `
      .tri-advanced-search-form {
        padding: 24px;
        background: #fbfbfb;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
      }

      .search-result-list {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fafafa;
        min-height: 200px;
        text-align: center;
        padding-top: 80px;
      }
    `
  ]
})
export class TriDemoFormAdvancedComponent implements OnInit {
  validateForm: FormGroup;
  controlArray = [];
  isCollapse   = true;

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
    this.controlArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < 6 : true;
    });
  }

  resetForm() {
    this.validateForm.reset();
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({});

    for (let i = 0; i < 10; i++) {
      this.controlArray.push({index: i, show: i < 6});
      this.validateForm.addControl(`field${i}`, new FormControl());
    }
  }
}
