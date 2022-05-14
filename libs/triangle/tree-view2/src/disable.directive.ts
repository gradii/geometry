/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ChangeDetectorRef, Directive, Input, OnChanges } from '@angular/core';
import { TreeViewComponent } from './treeview.component';
import { TreeItem } from './treeitem.interface';

@Directive({ selector: '[triTreeViewDisable]' })
export class DisableDirective implements OnChanges {
  treeView: TreeViewComponent;
  cdr: ChangeDetectorRef;
  @Input('kendoTreeViewDisable')
  disableKey: string | ((context: TreeItem) => any);
  @Input()
  disabledKeys: any[];

  constructor(treeView: TreeViewComponent, cdr: ChangeDetectorRef) {
    this.treeView = treeView;
    this.cdr = cdr;
    /**
     * Defines the collection that will store the disabled keys.
     */
    this.disabledKeys = [];
    this.treeView.isDisabled = (dataItem, index) => (this.disabledKeys.indexOf(this.itemKey({ dataItem, index })) > -1);
  }

  /**
   * @hidden
   */
  @Input()
  set isDisabled(value: (item: object, index: string) => boolean) {
    this.treeView.isDisabled = value;
  }

  ngOnChanges(changes: any = {}) {
    const { disabledKeys } = changes;
    if (disabledKeys && !disabledKeys.firstChange) {
      this.cdr.markForCheck();
    }
  }

  itemKey(e: any) {
    if (!this.disableKey) {
      return e.index;
    }
    if (typeof this.disableKey === 'string') {
      return e.dataItem[this.disableKey];
    }
    if (typeof this.disableKey === 'function') {
      return this.disableKey(e);
    }
  }
}
