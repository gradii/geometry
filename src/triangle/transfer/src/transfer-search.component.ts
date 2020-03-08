/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tri-transfer-search',
  template: `
    <input tri-input [(ngModel)]="value" (ngModelChange)="_handle()"
           [placeholder]="placeholder" class="tri-transfer-list-search">
    <a *ngIf="value && value.length > 0; else def" class="tri-transfer-list-search-action" (click)="_clear()">
      <i class="anticon anticon-cross-circle"></i>
    </a>
    <ng-template #def><span class="tri-transfer-list-search-action"><i class="anticon anticon-search"></i></span></ng-template>
  `
})
export class TransferSearchComponent {
  // region: fields

  @Input() placeholder: string;
  @Input() value: string;

  @Output() valueChanged = new EventEmitter<string>();
  @Output() valueClear = new EventEmitter();

  // endregion

  _handle(): void {
    this.valueChanged.emit(this.value);
  }

  _clear(): void {
    this.value = '';
    this.valueClear.emit();
  }
}
