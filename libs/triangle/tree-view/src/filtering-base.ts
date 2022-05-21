/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DataBoundComponent } from './data-bound-component';
import { TreeItemFilterState } from './drag-and-drop/models/tree-item-filter-state';
import { DEFAULT_FILTER_SETTINGS, TreeViewFilterSettings } from './treeview-filter-settings';
import { Input } from '@angular/core';
import { filterTree, isPresent } from './utils';

/**
 * @hidden
 */
export abstract class FilteringBase {
  component: DataBoundComponent;
  filterData: TreeItemFilterState[];
  visibleNodes: Set<any>;
  _filterSettings: any;

  constructor(component: DataBoundComponent) {
    this.component       = component;
    this.visibleNodes    = new Set();
    this._filterSettings = DEFAULT_FILTER_SETTINGS;
  }

  /**
   * The settings which are applied when performing a filter on the component's data.
   */
  @Input()
  get filterSettings(): TreeViewFilterSettings {
    return this._filterSettings;
  }

  set filterSettings(settings: TreeViewFilterSettings) {
    this._filterSettings = Object.assign({}, DEFAULT_FILTER_SETTINGS, settings);
  }

  /**
   * Applies a filter and changes the visibility of the component's nodes accordingly.
   */
  @Input()
  set filter(term: string) {
    this.handleFilterChange(term);
  }

  /**
   * @hidden
   */
  handleFilterChange(term: string) {
    if (!this.filterData) {
      return;
    }
    this.resetNodesVisibility(this.filterData);
    if (term) {
      filterTree(this.filterData, term, this.filterSettings, this.component.textField);
    }
    this.updateVisibleNodes(this.filterData);
    if (isPresent(this.component.filterStateChange)) {
      this.component.filterStateChange.emit({
        nodes         : this.filterData,
        matchCount    : this.visibleNodes.size,
        term,
        filterSettings: this.filterSettings
      });
    }
  }

  updateVisibleNodes(items: TreeItemFilterState[]) {
    items.forEach((wrapper) => {
      if (wrapper.visible) {
        this.visibleNodes.add(wrapper.dataItem);
      }
      if (wrapper.children) {
        this.updateVisibleNodes(wrapper.children);
      }
    });
  }

  resetNodesVisibility(items: TreeItemFilterState[]) {
    this.visibleNodes.clear();
    items.forEach((wrapper) => {
      wrapper.visible = true;
      if (wrapper.children) {
        this.resetNodesVisibility(wrapper.children);
      }
    });
  }
}
