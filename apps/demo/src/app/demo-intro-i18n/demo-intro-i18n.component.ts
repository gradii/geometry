import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'demo-intro-i18n',
  templateUrl: 'demo-intro-i18n.component.html'
})
export class DemoIntroI18nComponent implements OnInit {
  markdownContent = require('!!raw-loader!./README.md');

  constructor() {}

  ngOnInit() {}
}
