import { Component, OnInit } from '@angular/core';

/**
 * @title input-basic
 */
@Component({
  selector: 'tri-demo-input-basic',
  template: `
    <tri-input [(ngModel)]="inputValue" [placeHolder]="'Basic usage'" (ngModelChange)="_console($event)"></tri-input>
    <p>{{inputValue}}</p>`,

  styles: []
})
export class TriDemoInputBasicComponent implements OnInit {
  inputValue: string;

  _console(value) {
    console.log(value);
  }

  constructor() {}

  ngOnInit() {}
}
