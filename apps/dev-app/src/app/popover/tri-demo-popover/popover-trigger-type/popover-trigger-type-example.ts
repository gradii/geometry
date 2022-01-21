/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { TriDialogService } from '@gradii/triangle/dialog';

@Component({
  selector: 'popover-trigger-type-dialog',
  template: `
    <div>
      <p>this is a short sentence</p>
    </div>

  `
})
export class PopoverDialogDemo {

}

/**
 * @title Basic popover
 */
@Component({
  selector   : 'popover-trigger-type-example',
  templateUrl: 'popover-trigger-type-example.html',
})
export class PopoverTriggerTypeExample {
  triggerType: string = 'click';

  constructor(private dialogService: TriDialogService) {
  }

  openDialog() {
    this.dialogService.open(PopoverDialogDemo);
  }
}
