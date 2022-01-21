/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { TriDialogService } from '@gradii/triangle/dialog';

@Component({
  selector: 'dialog-dummy',
  template: `
    <tri-card>
      <tri-card-header>
        hello title
      </tri-card-header>
      <tri-card-body>
        body content
      </tri-card-body>
    </tri-card>
  `
})
export class DialogCard {

}

@Component({
  selector: 'tri-demo-dialog-basic',
  template: `
    <button tri-button (click)="onOpen()">open dialog card</button>
  `
})
export class TriDemoDialogCardComponent {
  constructor(
    private dialogService: TriDialogService
  ) {
  }

  onOpen() {
    this.dialogService.open(DialogCard);
  }
}
