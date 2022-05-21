/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Directive, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges
} from '@angular/core';
import { ExpandableComponent } from './expandable-component';
import { merge, Subscription } from 'rxjs';
import { TreeItem } from './treeitem.interface';
import { FilterExpandSettings } from './filter-expand-settings.interface';
import { map } from 'rxjs/operators';
import { isArrayWithAtLeastOneItem, isBoolean, sameValues } from './utils';
import { isChanged } from './helper/changes';

/** @hidden */
interface ExpandTreeItem extends TreeItem {
  expand: boolean;
}

const DEFAULT_FILTER_EXPAND_SETTINGS: FilterExpandSettings = {
  maxAutoExpandResults: -1,
  expandMatches       : false,
  expandedOnClear     : 'none'
};

@Directive({selector: '[triTreeViewExpandable]'})
export class ExpandDirective implements OnDestroy, OnChanges {
  component: ExpandableComponent;
  @Input('expandBy')
  expandKey: string | ((context: TreeItem) => any);
  @Input()
  expandOnFilter: boolean | FilterExpandSettings;
  @Output()
  expandedKeysChange: EventEmitter<any[]>;
  @Input()
  expandedKeys: any[];
  subscriptions: Subscription;
  state: any;
  originalExpandedKeys: any;
  isFiltered: any;
  lastChange: any;
  updateExpandedNodes: any;
  getEveryExpandKey: any;

  constructor(component: ExpandableComponent) {
    this.component = component;
    /**
     * Whether or not to auto-expand the nodes leading from the root node to each filter result.
     * To fine-tune this behavior, pass a [`FilterExpandSettings`]({% slug api_treeview_filterexpandsettings %}) object to this input.
     * @default false
     */
    this.expandOnFilter = false;
    /**
     * Fires when the `expandedKeys` collection was updated.
     */
    this.expandedKeysChange = new EventEmitter();
    this.subscriptions = new Subscription();
    /**
     * Reflectes the internal `expandedKeys` state.
     */
    this.state = new Set();
    this.originalExpandedKeys = new Set();
    this.isFiltered           = false;
    /**
     * Fills array with the correct expand keys according to wrapper metadata.
     */
    this.updateExpandedNodes = (collection, node, autoExpandMatches) => {
      if (node.containsMatches || node.isMatch && autoExpandMatches && isArrayWithAtLeastOneItem(
        node.children)) {
        collection.push(this.itemKey({dataItem: node.dataItem, index: node.index}));
      }
      if (isArrayWithAtLeastOneItem(node.children)) {
        node.children.forEach(child => {
          this.updateExpandedNodes(collection, child, autoExpandMatches);
        });
      }
    };
    /**
     * Fills array with the expand key of every node.
     */
    this.getEveryExpandKey = (collection, node) => {
      if (isArrayWithAtLeastOneItem(node.children)) {
        collection.push(this.itemKey({dataItem: node.dataItem, index: node.index}));
      }
      if (isArrayWithAtLeastOneItem(node.children)) {
        node.children.forEach(child => {
          this.getEveryExpandKey(collection, child);
        });
      }
    };
    this.subscriptions.add(
      merge(this.component.expand.pipe(map(e => (Object.assign({expand: true}, e)))),
        this.component.collapse.pipe(map(e => (Object.assign({expand: false}, e))))).subscribe(
        this.toggleExpand.bind(this)));
    if (this.component.filterStateChange) {
      this.subscriptions.add(
        this.component.filterStateChange.subscribe(this.handleAutoExpand.bind(this)));
    }
    this.component.isExpanded = (dataItem, index) => this.state.has(
      this.itemKey({dataItem, index}));
  }

  /**
   * @hidden
   */
  @Input()
  set isExpanded(value: (item: object, index: string) => boolean) {
    this.component.isExpanded = value;
  }

  get filterExpandSettings(): FilterExpandSettings {
    const settings = isBoolean(this.expandOnFilter) ?
      {enabled: this.expandOnFilter} :
      Object.assign({}, this.expandOnFilter, {enabled: true});
    return Object.assign({}, DEFAULT_FILTER_EXPAND_SETTINGS, settings);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (isChanged('expandedKeys', changes,
      false) && changes.expandedKeys.currentValue !== this.lastChange) {
      this.state = new Set(changes.expandedKeys.currentValue);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * @hidden
   */
  itemKey(e: TreeItem) {
    if (this.expandKey) {
      if (typeof this.expandKey === 'string') {
        return e.dataItem[this.expandKey];
      }
      if (typeof this.expandKey === 'function') {
        return this.expandKey(e);
      }
    }
    return e.index;
  }

  toggleExpand({index, dataItem, expand}) {
    const key        = this.itemKey({index, dataItem});
    const isExpanded = this.state.has(key);
    let notify       = false;
    if (isExpanded && !expand) {
      this.state.delete(key);
      notify = true;
    } else if (!isExpanded && expand) {
      this.state.add(key);
      notify = true;
    }
    if (notify) {
      this.notify();
    }
  }

  handleAutoExpand({nodes, matchCount, term}): any {
    if (!this.filterExpandSettings.enabled) {
      return;
    }
    const {
            maxAutoExpandResults,
            expandMatches: autoExpandMatches,
            expandedOnClear
          } = this.filterExpandSettings;
    if (!this.isFiltered) {
      this.originalExpandedKeys = new Set(this.state);
    }
    const exitingFilteredState  = this.isFiltered && !term;
    const maxExceeded           = maxAutoExpandResults !== -1 && matchCount > maxAutoExpandResults;
    const exitAutoExpandedState = exitingFilteredState || maxExceeded;
    if (exitAutoExpandedState) {
      switch (expandedOnClear) {
        case 'initial': {
          if (!sameValues(this.state, this.originalExpandedKeys)) {
            this.state = this.originalExpandedKeys;
            this.notify();
          }
          break;
        }
        case 'all': {
          this.state = new Set(nodes.reduce((acc, rootNode) => {
            this.getEveryExpandKey(acc, rootNode);
            return acc;
          }, []));
          this.notify();
          break;
        }
        case 'unchanged': {
          break;
        }
        case 'none':
        default: {
          if (this.state.size !== 0) {
            this.state.clear();
            this.notify();
          }
          break;
        }
      }
      this.isFiltered = false;
      return;
    }
    const indicesToExpand = new Set(nodes.reduce((acc, rootNode) => {
      this.updateExpandedNodes(acc, rootNode, autoExpandMatches);
      return acc;
    }, []));
    if (!sameValues(this.state, indicesToExpand)) {
      this.state = indicesToExpand;
      this.notify();
    }
    this.isFiltered = true;
  }

  notify(): any {
    this.lastChange = Array.from(this.state);
    this.expandedKeysChange.emit(this.lastChange);
  }
}
