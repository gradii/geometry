import { Component, OnInit } from '@angular/core';

/**
 * @title calendar-locale
 */
@Component({
  selector: 'tri-demo-calendar-locale',
  template: `
    <tri-calendar [locale]="'en'"></tri-calendar>`,
  styles: []
})
export class TriDemoCalendarLocaleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
