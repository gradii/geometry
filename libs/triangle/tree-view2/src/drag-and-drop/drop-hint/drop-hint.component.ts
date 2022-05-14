/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, TemplateRef
} from '@angular/core';
import { TreeItemLookup } from '../../treeitem-lookup.interface';
import { DropAction } from '../models';

@Component({
  selector: 'tri-treeview-drop-hint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      *ngIf="!template"
      class="k-drop-hint k-drop-hint-h"
    >
      <div class='k-drop-hint-start'></div>
      <div class='k-drop-hint-line'></div>
    </div>

    <ng-template
      *ngIf="template"
      [ngTemplateOutlet]="template"
      [ngTemplateOutletContext]="{
                action: action,
                sourceItem: sourceItem,
                destinationItem: destinationItem
            }"
    >
      <ng-template>
  `
})
export class DropHintComponent {
  changeDetectorRef: any;
  @HostBinding('class.k-drop-hint-container')
  hostClass: boolean;
  template: TemplateRef<any>;
  @HostBinding('style.position')
  position: string;
  @HostBinding('style.pointer-events')
  pointerEvents: string;
  action: DropAction;
  sourceItem: TreeItemLookup;
  destinationItem: TreeItemLookup;

  constructor(changeDetectorRef: ChangeDetectorRef) {
    this.changeDetectorRef = changeDetectorRef;
    this.hostClass         = true;
    this.position          = 'fixed';
    this.pointerEvents     = 'none';
  }

  // exposed as a public method that can be called from outside as the component uses `OnPush` strategy
  detectChanges() {
    this.changeDetectorRef.detectChanges();
  }
}
