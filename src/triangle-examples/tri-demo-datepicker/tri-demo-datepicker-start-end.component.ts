/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

/**
 * @title datepicker-start-end
 */
@Component({
  selector: 'tri-demo-datepicker-start-end',
  template: `
              <tri-datepicker style="width: 40%;"
                             (ngModelChange)="_startDate=$event;_startValueChange()"
                             [ngModel]="_startDate"
                             [disabledDate]="_disabledStartDate"
                             [showTime]="true"
                             [format]="'YYYY-MM-DD HH:mm:ss'"
                             [placeHolder]="'Start date'"></tri-datepicker>
              <tri-datepicker style="width: 40%;"
                             (ngModelChange)="_endDate=$event;_endValueChange()"
                             [ngModel]="_endDate"
                             [disabledDate]="_disabledEndDate"
                             [showTime]="_endTime"
                             [format]="'YYYY-MM-DD HH:mm:ss'"
                             [placeHolder]="'End date'"></tri-datepicker>`,
  styles: []
})
export class TriDemoDatePickerStartEndComponent implements OnInit {
  _startDate = null;
  _endDate = null;
  newArray = len => {
    const result = [];
    for (let i = 0; i < len; i++) {
      result.push(i);
    }
    return result;
  };
  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }
  };
  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }
  };
  _disabledStartDate = startValue => {
    if (!startValue || !this._endDate) {
      return false;
    }
    return startValue.getTime() >= this._endDate.getTime();
  };
  _disabledEndDate = endValue => {
    if (!endValue || !this._startDate) {
      return false;
    }
    return endValue.getTime() <= this._startDate.getTime();
  };

  get _isSameDay() {
    return this._startDate && this._endDate && moment(this._startDate).isSame(this._endDate, 'day');
  }

  get _endTime() {
    return {
      hideDisabledOptions: true,
      disabledHours: () => {
        return this._isSameDay ? this.newArray(this._startDate.getHours()) : [];
      },
      disabledMinutes: h => {
        if (this._isSameDay && h === this._startDate.getHours()) {
          return this.newArray(this._startDate.getMinutes());
        }
        return [];
      },
      disabledSeconds: (h, m) => {
        if (this._isSameDay && h === this._startDate.getHours() && m === this._startDate.getMinutes()) {
          return this.newArray(this._startDate.getSeconds());
        }
        return [];
      }
    };
  }

  constructor() {}

  ngOnInit() {}
}
