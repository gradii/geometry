/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, TemplateRef
} from '@angular/core';
import { DropAction } from '../models';
import { TreeItemLookup } from '../../treeitem-lookup.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector       : 'tri-treeview-drag-clue',
  template       : `
    <ng-container *ngIf="!template">
      <span class="k-icon {{statusIconClass}} k-drag-status"></span>
      <span>{{text}}</span>
    </ng-container>

    <ng-template
      *ngIf="template"
      [ngTemplateOutlet]="template"
      [ngTemplateOutletContext]="{
                text: text,
                action: action,
                sourceItem: sourceItem,
                destinationItem: destinationItem
            }"
    >
    </ng-template>
  `
})
export class DragClueComponent {
  cdr: any;

  @HostBinding('class.k-header')
  hostClasses: boolean;
  text: string;
  action: DropAction;
  sourceItem: TreeItemLookup;
  destinationItem: TreeItemLookup;
  template: TemplateRef<any>;

  @HostBinding('style.position')
  posistionStyle: string;

  constructor(cdr: ChangeDetectorRef) {
    this.cdr            = cdr;
    this.hostClasses    = true;
    this.posistionStyle = 'fixed';
  }

  get statusIconClass(): string {
    switch (this.action) {
      case DropAction.Add:
        return 'k-i-plus';
      case DropAction.InsertTop:
        return 'k-i-insert-up';
      case DropAction.InsertBottom:
        return 'k-i-insert-down';
      case DropAction.InsertMiddle:
        return 'k-i-insert-middle';
      case DropAction.Invalid:
      default:
        return 'k-i-cancel';
    }
  }

  // exposed as a public method that can be called from outside as the component uses `OnPush` strategy
  detectChanges() {
    this.cdr.detectChanges();
  }
}
