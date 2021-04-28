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
 * @title card-flex
 */
@Component({
  selector: 'tri-demo-card-flex',
  template: `
    <tri-card style="width:240px">
      <ng-template triCardBody>
        <div class="custom-image">
          <img alt="example" width="100%"
               src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>
        </div>
        <div class="custom-card">
          <h3>Europe Street beat</h3>
          <p>www.instagram.com</p>
        </div>
      </ng-template>
    </tri-card>
  `,
  styles  : [
    `
      :host ::ng-deep .custom-image img {
        display: block;
      }

      :host ::ng-deep .custom-card {
        padding: 10px 16px;
      }

      :host ::ng-deep .custom-card p {
        color: #999;
      }

      :host ::ng-deep .tri-card-body {
        padding: 0;
      }`
  ]
})
export class TriDemoCardFlexComponent implements OnInit {
  bodyStyle = {padding: 0};

  ngOnInit() {
  }
}
