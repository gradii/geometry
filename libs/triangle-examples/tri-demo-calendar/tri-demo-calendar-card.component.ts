import { Component, OnInit } from '@angular/core';

/**
 * @title calendar-card
 */
@Component({
  selector: 'tri-demo-calendar-card',
  template: `
    <tri-calendar [locale]="'zh-cn'" [fullScreen]="false" style="width: 290px; border: 1px solid rgb(217, 217, 217); border-radius: 4px;"></tri-calendar>`,
  styles: []
})
export class TriDemoCalendarCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
