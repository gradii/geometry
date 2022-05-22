/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NavigationItem } from './navigation-item.interface';
import { IndexBuilderService } from '../index-builder.service';
import { isPresent } from '@gradii/check-type';

export const safe         = node => (node || {});
export const safeChildren = node => (safe(node).children || []);

export const lastVisibleNode = (nodes) => {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return null;
  }
  const nodesCount = nodes.length;
  const lastIndex  = nodesCount - 1;
  for (let index = lastIndex; index >= 0; index -= 1) {
    const node = nodes[index];
    if (node.visible) {
      return node;
    }
  }
  return null;
};

/**
 * @hidden
 */
export class NavigationModel {
  ib: IndexBuilderService = new IndexBuilderService();
  nodes: any[]            = [];

  constructor() {
  }

  firstVisibleNode() {
    return (this.nodes || []).find(node => node.visible);
  }

  lastVisibleNode() {
    let node = lastVisibleNode(this.nodes);
    while (isPresent(node) && safeChildren(node).length > 0) {
      const children         = safeChildren(node);
      const lastVisibleChild = lastVisibleNode(children);
      if (!isPresent(lastVisibleChild)) {
        return node;
      }
      node = lastVisibleChild;
    }
    return node;
  }

  closestNode(index: string) {
    const {prev}  = safe(this.findNode(index));
    const sibling = prev || this.firstVisibleNode();
    return safe(sibling).index === index ? this.visibleSibling(sibling, 1) : sibling;
  }

  firstFocusableNode() {
    return this.nodes.find((node) => {
      return !node.disabled && node.visible;
    });
  }

  findNode(index: string) {
    return this.find(index, this.nodes);
  }

  findParent(index: string) {
    const parentLevel = this.ib.level(index) - 1;
    return this.findNode(this.ib.indexForLevel(index, parentLevel));
  }

  findVisibleChild(index: string) {
    const node     = this.findNode(index);
    const children = safeChildren(node);
    return children.find((child) => child.visible);
  }

  findVisiblePrev(item: NavigationItem) {
    const index           = item.index;
    const parent          = this.findParent(index);
    const levelIndex      = this.ib.lastLevelIndex(index);
    const prevNodes       = this.container(parent).slice(0, levelIndex);
    const prevNodesHidden = prevNodes.every(node => !node.visible);
    if (levelIndex === 0 || prevNodesHidden) {
      return parent;
    }
    const currentNode = this.findNode(index);
    let prev          = this.visibleSibling(currentNode, -1);
    if (prev) {
      let children = this.container(prev);
      while (children.length > 0 && children.some(node => node.visible)) {
        prev     = lastVisibleNode(children);
        children = this.container(prev);
      }
    }
    return prev;
  }

  findVisibleNext(item: NavigationItem) {
    const children           = this.container(item);
    const hasVisibleChildren = children.some(child => child.visible);
    if (children.length === 0 || !hasVisibleChildren) {
      return this.visibleSibling(item, 1);
    }
    return children.find(child => child.visible);
  }

  registerItem(id: number, index: string, disabled: boolean, loadMoreButton: boolean = false,
               visible: boolean                                                      = true) {
    const children = [];
    const level    = this.ib.level(index);
    const parent   = this.findParent(index);
    if (parent || level === 1) {
      const node = {id, children, index, parent, disabled, loadMoreButton, visible};
      this.insert(node, parent);
    }
  }

  unregisterItem(id: number, index: string) {
    const node = this.find(index, this.nodes);
    if (!node || node.id !== id) {
      return;
    }
    const children = this.container(node.parent);
    children.splice(children.indexOf(node), 1);
  }

  childLevel(nodes): any {
    const children = nodes.filter(node => isPresent(node));
    if (!children || !children.length) {
      return 1;
    }
    return this.ib.level(children[0].index);
  }

  container(node): any {
    return node ? node.children : this.nodes;
  }

  find(index, nodes): any {
    const childLevel   = this.childLevel(nodes);
    const indexToMatch = this.ib.indexForLevel(index, childLevel);
    const isLeaf       = childLevel === this.ib.level(index);
    const node         = nodes.find(n => n && n.index === indexToMatch);
    if (!node) {
      return null;
    }
    return isLeaf ? node : this.find(index, node.children);
  }

  insert(node, parent): any {
    const nodes = this.container(parent);
    nodes.splice(this.ib.lastLevelIndex(node.index), 0, node);
  }

  visibleSibling(node, offset): any {
    if (!node) {
      return null;
    }
    const parent      = this.findParent(node.index);
    const container   = this.container(parent);
    let nextItemIndex = container.indexOf(node) + offset;
    let nextItem      = container[nextItemIndex];
    while (isPresent(nextItem)) {
      if (nextItem.visible) {
        return nextItem;
      }
      nextItemIndex += offset;
      nextItem = container[nextItemIndex];
    }
    return this.visibleSibling(parent, offset);
  }
}
