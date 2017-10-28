import { Component } from '@angular/core';

@Component({
  selector: 'demo-intro-changelog',
  templateUrl: './demo-intro-changelog.html'
})
export class DemoIntroChangelogComponent {
  _markdownCode = require('!!raw-loader!./README.md');

  constructor() {}
}
