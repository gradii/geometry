import { Component, OnInit } from '@angular/core';

/**
 * @title input-textarea
 */
@Component({
  selector: 'tri-demo-input-textarea',
  template: `
    <tri-input [(ngModel)]="inputValue" [type]="'textarea'" [rows]="'4'" [placeHolder]="''"></tri-input>`,
  styles: []
})
export class TriDemoInputTextareaComponent implements OnInit {
  inputValue: string;

  constructor() {}

  ngOnInit() {}
}
