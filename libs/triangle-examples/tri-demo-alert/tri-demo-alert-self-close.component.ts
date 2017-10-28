import { Component, OnInit } from '@angular/core';

/**
 * @title alert-self-close
 */
@Component({
  selector: 'tri-demo-alert-self-close',
  template: `
    <tri-alert [type]="'info'" [message]="'Info Text'" [closeText]="'Close Now'">
    </tri-alert>
  `
})
export class TriDemoAlertSelfCloseComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
