/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@gradii/triangle/tooltip';


@Component({
  selector: 'tri-demo-confirm-popup-auto-hide',
  template: `
    <div class="example-container" cdkScrollable>
  <button triButton #ConfirmPopup="triConfirmPopup"
          triConfirmPopup="Info about the action"
          [triConfirmPopupPosition]="position.value"
          triConfirmPopupHideDelay="100000"
          aria-label="Button that displays a ConfirmPopup that hides when scrolled out of the container"
          class="example-button">
    Action
  </button>
</div>
    `,
  styles  : [`
    .example-button {
        display: block;
        margin: 80px auto 400px;
    }

    .example-container {
        height: 200px;
        overflow: auto;
        border: 1px solid #ccc;
    }
    `]
})
export class TriDemoConfirmPopupAutoHideComponent {
  positionOptions: TooltipPosition[] = ['bottom', 'top', 'left', 'right'];

  position = new FormControl(this.positionOptions[0]);
}
