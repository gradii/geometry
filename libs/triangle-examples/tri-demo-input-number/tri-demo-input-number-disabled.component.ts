import { Component, OnInit } from '@angular/core';

/**
 * @title input-number-disabled
 */
@Component({
  selector: 'tri-demo-input-number-disabled',
  template: `
    <tri-input-number [(ngModel)]="demoValue" [min]="1" [max]="10" [step]="1" [disabled]="isDisabled"></tri-input-number>
    <div style="margin-top:20px;">
      <button tri-button [type]="'primary'" (click)="toggleDisabled()">
        <span>Toggle Disabled</span>
      </button>
    </div>`,

  styles: []
})
export class TriDemoInputNumberDisabledComponent implements OnInit {
  demoValue = 3;
  isDisabled = false;
  toggleDisabled = () => {
    this.isDisabled = !this.isDisabled;
  };

  constructor() {}

  ngOnInit() {}
}
