import { Component } from '@angular/core';

/**
 * @title slider-event
 */
@Component({
  selector: 'tri-demo-slider-event',
  template: `
    <tri-slider
      [defaultValue]="30"
      [(ngModel)]="singleValue" (ngModelChange)="onChange($event)"
      (onAfterChange)="onAfterChange($event)"
    ></tri-slider>
    <tri-slider
      range
      [step]="10"
      [defaultValue]="[20, 50]"
      [(ngModel)]="rangeValue" (ngModelChange)="onChange($event)"
      (onAfterChange)="onAfterChange($event)"
    ></tri-slider>
  `
})
export class TriDemoSliderEventComponent {
  singleValue;
  rangeValue;

  onChange(value) {
    console.log(`onChange: ${value}`);
  }

  onAfterChange(value) {
    console.log(`onAfterChange: ${value}`);
  }
}
