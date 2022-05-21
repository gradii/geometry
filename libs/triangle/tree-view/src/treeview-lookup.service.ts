/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TreeItem } from './treeitem.interface';
import { Injectable } from '@angular/core';
import { nodeIndex } from './utils';

const INDEX_REGEX = /\d+$/;

@Injectable()
export class TreeViewLookupService {
  map: any;

  /**
   * @hidden
   */
  constructor() {
    this.map = new Map();
  }

  reset() {
    this.map.clear();
  }

  registerItem(item: TreeItem, parent: TreeItem) {
    const currentLookup = {
      children: [],
      item,
      parent  : this.item(nodeIndex(parent))
    };
    this.map.set(item.index, currentLookup);
  }

  registerChildren(index: string, children: TreeItem[]) {
    const item = this.item(index);
    if (!item) {
      return;
    }
    item.children = children;
  }

  unregisterItem(index: string, dataItem: any) {
    const current = this.item(index);
    if (current && current.item.dataItem === dataItem) {
      this.map.delete(index);
      if (current.parent && current.parent.children) {
        current.parent.children = current.parent.children.filter(
          item => item.dataItem !== dataItem);
      }
    }
  }

  replaceItem(index: string, item: TreeItem, parent: TreeItem) {
    if (!item) {
      return;
    }
    this.unregisterItem(index, item.dataItem);
    this.registerItem(item, parent);
    this.addToParent(item, parent);
  }

  itemLookup(index: string) {
    const item = this.item(index);
    if (!item) {
      return null;
    }
    return {
      children: this.mapChildren(item.children),
      item    : item.item,
      parent  : item.parent
    };
  }

  hasItem(index: string) {
    return this.map.has(index);
  }

  item(index: string) {
    return this.map.get(index) || null;
  }

  addToParent(item, parent): any {
    if (parent) {
      const parentItem    = this.item(parent.index);
      const index         = parseInt(INDEX_REGEX.exec(item.index)[0], 10);
      parentItem.children = parentItem.children || [];
      parentItem.children.splice(index, 0, item);
    }
  }

  mapChildren(children = []): any {
    return children.map(c => {
      const {item, parent, children} = this.item(c.index);
      return {
        children: this.mapChildren(children),
        item,
        parent
      };
    });
  }
}
