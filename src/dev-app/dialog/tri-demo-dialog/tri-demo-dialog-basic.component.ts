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
    <tri-card title="hello title">

    </tri-card>
  `
})
export class DialogDummy {

}

@Component({
  selector: 'tri-demo-dialog-basic',
  template: `
    <button tri-button (click)="onOpen()">open dialog</button>
  `
})
export class TriDemoDialogBasicComponent {
  constructor(
    private dialogService: TriDialogService
  ) {
  }

  onOpen() {
    this.dialogService.open(DialogDummy);
  }
}
