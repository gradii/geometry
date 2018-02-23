import { Component } from '@angular/core';

@Component({
  selector   : 'demo-intro-get-started',
  templateUrl: './demo-intro-get-started.html'
})
export class DemoIntroGetStartedComponent {
  _markdownCode = require('!!raw-loader!./README.md');

  constructor() {}
}
