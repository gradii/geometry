/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title slider-icon
 *
 * @description styleUrls: [ './tri-demo-slider-icon.scss' ]
 */
@Component({
  selector: 'tri-demo-slider-icon',
  template: `
    <div class="icon-wrapper test-class">
      <i [ngClass]="preIconClassMap"></i>
      <tri-slider [min]="0" [max]="20" [(ngModel)]="sliderValue"></tri-slider>
      <i [ngClass]="nextIconClassMap"></i>
    </div>
  `
})
export class TriDemoSliderIconComponent implements OnInit {
  min = 0;
  max = 20;
  mid = parseFloat(((this.max - this.min) / 2).toFixed(5));
  preIconClassMap = {
    anticon: true,
    'anticon-frown-o': true
  };
  nextIconClassMap = {
    anticon: true,
    'anticon-smile-o': true
  };

  _sliderValue;
  set sliderValue(value: number) {
    this._sliderValue = value;
    this.highlightIcon();
  }

  get sliderValue() {
    return this._sliderValue;
  }

  ngOnInit() {
    this.sliderValue = 0;
  }

  highlightIcon() {
    const lower = this._sliderValue >= this.mid;
    this.preIconClassMap['anticon-highlight'] = !lower;
    this.nextIconClassMap['anticon-highlight'] = lower;
  }
}
