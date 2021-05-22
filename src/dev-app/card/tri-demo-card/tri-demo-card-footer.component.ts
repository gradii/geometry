/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title card-basic
 */
@Component({
  selector: 'tri-demo-card-footer',
  template: `
    <tri-card style="width:300px;">
      <tri-card-header>
        Card title
        <tri-card-header-extra>
          <a>More</a>
        </tri-card-header-extra>
      </tri-card-header>
      <tri-card-body>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </tri-card-body>
      <tri-card-footer>
        <button triButton [ghost]="true">Btn</button>
      </tri-card-footer>
    </tri-card>
  `,
  styles  : []
})
export class TriDemoCardFooterComponent implements OnInit {
  ngOnInit() {
  }
}
