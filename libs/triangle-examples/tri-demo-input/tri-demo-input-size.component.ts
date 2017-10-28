import { Component, OnInit } from '@angular/core';

/**
 * @title input-size
 */
@Component({
  selector: 'tri-demo-input-size',
  template: `
    <div>
      <tri-input [(ngModel)]="inputValue" [placeHolder]="'large size'" [size]="'large'"></tri-input>
      <tri-input [(ngModel)]="inputValue" [placeHolder]="'default size'"></tri-input>
      <tri-input [(ngModel)]="inputValue" [placeHolder]="'small size'" [size]="'small'"></tri-input>
    </div>`,

  styles: [
    `
      tri-input {
        width: 200px;
        margin: 0 8px 8px 0;
      }
    `
  ]
})
export class TriDemoInputSizeComponent implements OnInit {
  inputValue: string;

  constructor() {}

  ngOnInit() {}
}
