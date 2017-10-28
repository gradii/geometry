import { Component, OnInit } from '@angular/core';

/**
 * @title checkbox-controller
 */
@Component({
  selector: 'tri-demo-checkbox-controller',
  template: `
    <p style="margin-bottom: 20px;">
      <label tri-checkbox [(ngModel)]="isCheckedButton" [disabled]="isDisabledButton">
        <span>{{isCheckedButton ? 'Checked' : 'Unchecked'}} - {{isDisabledButton ? 'Disabled' : 'Enabled'}}</span>
      </label>
    </p>
    <p>
      <button tri-button [type]="'primary'" (click)="checkButton()" [size]="'small'">
        <span>{{!isCheckedButton ? 'Checked' : 'Unchecked'}}</span>
      </button>
      <button tri-button [type]="'primary'" (click)="disableButton()" [size]="'small'">
        <span>{{isDisabledButton ? 'Enabled' : 'Disabled'}}</span>
      </button>
    </p>
  `,
  styles: []
})
export class TriDemoCheckboxControllerComponent implements OnInit {
  isCheckedButton = true;
  isDisabledButton = false;
  checkButton = () => {
    this.isCheckedButton = !this.isCheckedButton;
  };
  disableButton = () => {
    this.isDisabledButton = !this.isDisabledButton;
  };

  constructor() {}

  ngOnInit() {}
}
