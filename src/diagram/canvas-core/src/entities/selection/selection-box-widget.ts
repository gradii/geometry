/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'selection-box-widget',
  template: `
    <div class="selection-box-widget"
         [ngStyle]="{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }">
    </div>
  `,
  styles: [`
    .selection-box-widget {
      position: absolute;
      background-color: rgba(0, 192, 255, 0.2);
      border: solid 2px rgb(0, 192, 255);
    }
  `]
})
export class SelectionBoxWidget {

  @Input()
  rect: ClientRect;
}
