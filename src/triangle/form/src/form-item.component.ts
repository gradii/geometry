/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, HostBinding } from '@angular/core';

@Component({
  selector : 'tri-form-item',
  template : `
    <ng-content></ng-content>`,
  styleUrls: ['../style/form-item.css'],
  host     : {
    '[class.tri-form-item]': 'true'
  }
})
export class FormItemComponent {
  constructor() {
  }

  _withHelp = 0;

  @HostBinding(`class.tri-form-item-with-help`)
  get withHelp(): boolean {
    return this._withHelp > 0;
  }

  enableHelp() {
    this._withHelp++;
  }

  disableHelp() {
    this._withHelp--;
  }
}
