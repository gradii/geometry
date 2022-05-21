/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, Input, OnDestroy } from '@angular/core';
import { TreeViewComponent } from '../treeview.component';
import { EditService } from './models';
import { Subscription } from 'rxjs';
import { isPresent } from '../utils';

@Directive({
  selector: '[triTreeViewDragAndDropEditing]'
})
export class DragAndDropEditingDirective implements OnDestroy {
  treeview: any;
  subscriptions: any;

  constructor(treeview: TreeViewComponent) {
    this.treeview = treeview;
    this.subscriptions = new Subscription();
    this.subscriptions.add(this.treeview.addItem.subscribe(this.handleAdd.bind(this)));
    this.subscriptions.add(this.treeview.removeItem.subscribe(this.handleRemove.bind(this)));
  }

  /**
   * Specifies the handlers called on drag-and-drop [`addItem`]({% slug api_treeview_treeviewcomponent %}#toc-additem)
   * and [`removeItem`]({% slug api_treeview_treeviewcomponent %}#toc-removeitem) events.
   */
  @Input()
  set editService(service: EditService) {
    this.treeview.editService = service;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleAdd(args): any {
    if (!isPresent(this.treeview.editService)) {
      throw new Error('No `editService` provided. Either provide your own implementation or use this directive in combination with one of the data binding directives (`kendoTreeViewHierarchyBinding` or `kendoTreeViewFlatDataBinding`).');
    }
    this.treeview.editService.add(args);
  }

  handleRemove(args): any {
    if (!isPresent(this.treeview.editService)) {
      throw new Error('No `editService` provided. Either provide your own implementation or use this directive in combination with one of the data binding directives (`kendoTreeViewHierarchyBinding` or `kendoTreeViewFlatDataBinding`).');
    }
    this.treeview.editService.remove(args);
  }
}
