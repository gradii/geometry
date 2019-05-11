import { Component, OnInit } from '@angular/core';

/**
 * @title input-number-digit
 */
@Component({
  selector: 'tri-demo-input-number-digit',
  template: `
    <tri-input-number [(ngModel)]="demoValue" [min]="1" [max]="10" [step]="0.1"></tri-input-number>`,

  styles: []
})
export class TriDemoInputNumberDigitComponent implements OnInit {
  demoValue: number;

  constructor() {}

  ngOnInit() {}
}
