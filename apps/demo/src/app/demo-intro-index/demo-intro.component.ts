import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-intro',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './demo-intro.html',
  styleUrls: ['./demo-intro.less']
})
export class DemoIntroComponent implements OnInit {
  _markdownCode = require('!!raw-loader!./README.md');

  constructor() {}

  ngOnInit() {}
}
