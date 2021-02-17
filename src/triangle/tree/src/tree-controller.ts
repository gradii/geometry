/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NodeMenuItemAction } from './menu/menu.events';
import { Tree } from './tree';
import { TreeInternalComponent } from './tree-internal.component';
import { TreeService } from './tree.service';
import { TreeModel } from './tree.types';
import { MouseButtons } from './utils/event.utils';
import { get } from './utils/fn.utils';

export class TreeController {
  private tree: Tree;
  private treeService: TreeService;

  constructor(private component: TreeInternalComponent) {
    this.tree = this.component.tree;
    this.treeService = this.component.treeService;
  }

  select(): void {
    if (!this.isSelected()) {
      this.component.onNodeSelected({button: MouseButtons.Left});
    }
  }

  unselect(): void {
    if (this.isSelected()) {
      this.component.onNodeUnselected({button: MouseButtons.Left});
    }
  }

  isSelected(): boolean {
    return this.component.isSelected;
  }

  expand(): void {
    if (this.isCollapsed()) {
      this.component.onSwitchFoldingType();
    }
  }

  isExpanded(): boolean {
    return this.tree.isNodeExpanded();
  }

  collapse(): void {
    if (this.isExpanded()) {
      this.component.onSwitchFoldingType();
    }
  }

  isCollapsed(): boolean {
    return this.tree.isNodeCollapsed();
  }

  toTreeModel(): TreeModel {
    return this.tree.toTreeModel();
  }

  rename(newValue: string): void {
    this.tree.markAsBeingRenamed();
    this.component.applyNewValue({type: 'keyup', value: newValue});
  }

  remove(): void {
    this.component.onMenuItemSelected({nodeMenuItemAction: NodeMenuItemAction.Remove});
  }

  addChild(newNode: TreeModel): void {
    if (this.tree.hasDeferredChildren() && !this.tree.childrenWereLoaded()) {
      return;
    }

    const newTree = this.tree.createNode(Array.isArray(newNode.children), newNode);
    this.treeService.fireNodeCreated(newTree);
  }

  addChildAsync(newNode: TreeModel): Promise<Tree> {
    if (this.tree.hasDeferredChildren() && !this.tree.childrenWereLoaded()) {
      return Promise.reject(
        new Error('This node loads its children asynchronously, hence child cannot be added this way')
      );
    }

    const newTree = this.tree.createNode(Array.isArray(newNode.children), newNode);
    this.treeService.fireNodeCreated(newTree);

    // This will give TreeInternalComponent to set up a controller for the node
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(newTree);
      });
    });
  }

  changeNodeId(id: string | number) {
    if (!id) {
      throw Error('You should supply an id!');
    }

    if (this.treeService.hasController(id)) {
      throw Error(`Controller already exists for the given id: ${id}`);
    }

    this.treeService.deleteController(this.tree.id);
    this.tree.id = id;
    this.treeService.setController(this.tree.id, this);
  }

  reloadChildren(): void {
    this.tree.reloadChildren();
  }

  setChildren(children: TreeModel[]): void {
    if (!this.tree.isLeaf()) {
      this.tree.setChildren(children);
    }
  }

  startRenaming(): void {
    this.tree.markAsBeingRenamed();
  }

  check(): void {
    this.component.onNodeChecked();
  }

  uncheck(): void {
    this.component.onNodeUnchecked();
  }

  isChecked(): boolean {
    return this.tree.checked;
  }

  isIndetermined(): boolean {
    return get(this.component, 'checkboxElementRef.nativeElement.indeterminate');
  }

  allowSelection() {
    this.tree.selectionAllowed = true;
  }

  forbidSelection() {
    this.tree.selectionAllowed = false;
  }

  isSelectionAllowed(): boolean {
    return this.tree.selectionAllowed;
  }
}
