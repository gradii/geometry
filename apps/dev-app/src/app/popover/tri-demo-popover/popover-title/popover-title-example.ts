/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/**
 * @title Basic popover
 */
@Component({
  selector: 'popover-title-example',
  template: `
    <button triButton
            triPopover="Tooltip content"
            [triPopoverTitle]="'Tooltip Title ' + i"
            [triPopoverHideDelay]="100000"
            triPopoverPosition="top"
            aria-label="Button that displays a popover when focused or hovered over">
      Action
    </button>

    <button triButton (click)="beginDynamicChangeTitle()">
      Auto Change Tooltip Title
    </button>
  `,
  styles  : [`
               :host {
                 width  : 300px;
                 height : 200px;
                 margin : 50px
               }
             `]
})
export class PopoverTitleExample {
  i = 0;

  beginDynamicChangeTitle() {
    setInterval(() => {
      this.i += 1;
    }, 1000);
  }

}
