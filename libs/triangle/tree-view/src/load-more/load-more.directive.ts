/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Observable } from 'rxjs';
import { TreeViewComponent } from '../treeview.component';
import { LoadMoreRequestArgs } from './load-more-request-args';
import { Directive, Input, isDevMode } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { isPresent } from '@gradii/check-type';

@Directive({
  selector: '[triTreeViewLoadMore]'
})
export class LoadMoreDirective {
  treeview: any;
  @Input()
  pageSize: number;
  @Input()
  totalRootNodes: number;
  @Input()
  totalField: string;
  pageSizes: any;
  rootLevelId: any;

  constructor(treeview: TreeViewComponent) {
    this.treeview = treeview;
    /**
     * Keeps track of the current page size of each node over expand/collapse cycles.
     */
    this.pageSizes = new Map();
    /**
     * Used as an identifier for the root page size as the root collection of nodes is not associated with a data item.
     */
    this.rootLevelId = uuid();
    this.treeview.loadMoreService = {
      getInitialPageSize: this.getInitalPageSize.bind(this),
      getGroupSize      : this.getGroupSize.bind(this),
      setGroupSize      : this.setGroupSize.bind(this),
      getTotalNodesCount: this.getTotalNodesCount.bind(this)
    };
  }

  /**
   * Specifies the callback that will be called when the load more button is clicked.
   * Providing a function is only required when additional nodes are fetched on demand
   * ([see example]({% slug loadmorebutton_treeview %}#toc-remote-data)).
   */
  @Input('kendoTreeViewLoadMore')
  set loadMoreNodes(loadMoreNodes: string | ((loadMoreArgs: LoadMoreRequestArgs) => Observable<any[]>)) {
    if (typeof loadMoreNodes === 'string') {
      return;
    }
    this.treeview.loadMoreService.loadMoreNodes = loadMoreNodes;
  }

  ngOnChanges() {
    this.verifySettings();
  }

  verifySettings(): any {
    if (!isDevMode()) {
      return;
    }
    if (!isPresent(this.pageSize)) {
      throw new Error(`pageSize is required.`);
    }
    const loadMoreNodes = this.treeview.loadMoreService.loadMoreNodes;
    if (isPresent(loadMoreNodes) && typeof loadMoreNodes !== 'function') {
      throw new Error(`loadMoreNodes is required.`);
    }
    if (isPresent(loadMoreNodes) && !isPresent(this.totalField)) {
      throw new Error(`the \`totalField\` and \`totalRootNodes\` is required.`);
    }
  }

  getGroupSize(dataItem): any {
    const itemKey = dataItem || this.rootLevelId;
    return this.pageSizes.has(itemKey) ? this.pageSizes.get(itemKey) : this.pageSize;
  }

  setGroupSize(dataItem, pageSize): any {
    const itemKey             = dataItem || this.rootLevelId;
    const normalizedSizeValue = pageSize > 0 ? pageSize : 0;
    this.pageSizes.set(itemKey, normalizedSizeValue);
  }

  getTotalNodesCount(dataItem, loadedNodesCount): any {
    if (isPresent(dataItem) && isPresent(this.totalField)) {
      return dataItem[this.totalField];
    } else if (!isPresent(dataItem) && isPresent(this.totalRootNodes)) {
      return this.totalRootNodes;
    } else {
      return loadedNodesCount;
    }
  }

  getInitalPageSize(): any {
    return this.pageSize;
  }
}
