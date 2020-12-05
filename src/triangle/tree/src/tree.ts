/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Observable, Observer, of } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';
import { NodeMenuItem } from './menu/node-menu.component';
import {
  ChildrenLoadingFunction,
  FoldingType,
  RenamableNode,
  TreeModel,
  TreeModelSettings,
  TreeStatus
} from './tree.types';
import { defaultsDeep, get, has, includes, isEmpty, isFunction, isNil, omit, once, size, trim } from './utils/fn.utils';

enum ChildrenLoadingState {
  NotStarted,
  Loading,
  Completed
}

export class Tree {
  node: TreeModel;
  parent: Tree;
  private _loadChildren: ChildrenLoadingFunction;
  private _childrenLoadingState: ChildrenLoadingState = ChildrenLoadingState.NotStarted;

  /**
   * Build an instance of Tree from an object implementing TreeModel interface.
   * @parammodel - A model that is used to build a tree.
   * @param[parent] - An optional parent if you want to build a tree from the model that should be a child of an existing Tree instance.
   * @param[isBranch] - An option that makes a branch from created tree. Branch can have children.
   */
  constructor(node: TreeModel, parent: Tree = null, isBranch: boolean = false) {
    this.buildTreeFromModel(node, parent, isBranch || Array.isArray(node.children));
  }

  private _children: Tree[];

  // STATIC METHODS ----------------------------------------------------------------------------------------------------

  private _childrenAsyncOnce: () => Observable<Tree[]> = once(() => {
    return new Observable((observer: Observer<Tree[]>) => {
      setTimeout(() => {
        this._childrenLoadingState = ChildrenLoadingState.Loading;
        this._loadChildren((children: TreeModel[]) => {
          this._children = (children || []).map((child: TreeModel) => new Tree(child, this));
          this._childrenLoadingState = ChildrenLoadingState.Completed;
          observer.next(this.children);
          observer.complete();
        });
      });
    });
  });

  /**
   * Get children of the current tree.
   * return The children of the current tree.
   */
  get children(): Tree[] {
    return this._children;
  }

  /**
   * By getting value from this property you start process of loading node's children using `loadChildren` function.
   * Once children are loaded `loadChildren` function won't be called anymore and loaded for the first time children are emitted in case of subsequent calls.
   * return An observable which emits children once they are loaded.
   */
  get childrenAsync(): Observable<Tree[]> {
    if (this.canLoadChildren()) {
      return this._childrenAsyncOnce();
    }
    return of(this.children);
  }

  /**
   * Get the value of the current node
   * return The value of the node.
   */
  get value(): any {
    return this.node.value;
  }

  /**
   * Set the value of the current node
   * @paramvalue - The new value of the node.
   */
  set value(value: any) {
    if (typeof value !== 'string' && !Tree.isRenamable(value)) {
      return;
    }

    const stringifiedValue = '' + value;
    if (Tree.isRenamable(this.value)) {
      this.node.value = Tree.applyNewValueToRenamable(this.value as RenamableNode, stringifiedValue);
    } else {
      this.node.value = Tree.isValueEmpty(stringifiedValue) ? this.node.value : stringifiedValue;
    }
  }

  get checked(): boolean {
    return !!get(this.node.settings, 'checked');
  }

  set checked(checked: boolean) {
    this.node.settings = Object.assign({}, this.node.settings, {checked});
  }

  get checkedChildren(): Tree[] {
    return this.hasLoadedChildern() ? this.children.filter(child => child.checked) : [];
  }

  get selectionAllowed(): boolean {
    const value = get(this.node.settings, 'selectionAllowed');
    return isNil(value) ? true : !!value;
  }

  set selectionAllowed(selectionAllowed: boolean) {
    this.node.settings = Object.assign({}, this.node.settings, {selectionAllowed});
  }

  /**
   * Get a node's position in its parent.
   * return The position inside a parent.
   */
  get positionInParent(): number {
    if (this.isRoot()) {
      return -1;
    }

    return this.parent.children ? this.parent.children.indexOf(this) : -1;
  }

  /**
   * Get menu items of the current tree.
   * return The menu items of the current tree.
   */
  get menuItems(): NodeMenuItem[] {
    return get(this.node.settings, 'menuItems');
  }

  /**
   * Get a current folding type: expanded, collapsed or leaf.
   * return A folding type of the current tree.
   */
  get foldingType(): FoldingType {
    if (!this.node._foldingType) {
      this._setFoldingType();
    }
    return this.node._foldingType;
  }

  /**
   * Get a css class for element which displayes folding state - expanded, collapsed or leaf
   * return A string icontaining css class (classes)
   */
  get foldingCssClass(): string {
    return this.getCssClassesFromSettings() || this.foldingType.cssClass;
  }

  /**
   * Get a html template to render before every node's name.
   * return A string representing a html template.
   */
  get nodeTemplate(): string {
    return this.getTemplateFromSettings();
  }

  /**
   * Get a html template to render for an element activatin left menu of a node.
   * return A string representing a html template.
   */
  get leftMenuTemplate(): string {
    if (this.hasLeftMenu()) {
      return get(this.node.settings, 'templates.leftMenu', '<span></span>');
    }
    return '';
  }

  get id(): number | string {
    return get(this.node, 'id');
  }

  set id(id: number | string) {
    this.node.id = id;
  }

  /**
   * Check that value passed is not empty (it doesn't consist of only whitespace symbols).
   * @param value - A value that should be checked.
   * return - A flag indicating that value is empty or not.
   */
  static isValueEmpty(value: string): boolean {
    return isEmpty(trim(value));
  }

  /**
   * Check whether a given value can be considered RenamableNode.
   * @paramvalue - A value to check.
   * return - A flag indicating whether given value is Renamable node or not.
   */
  static isRenamable(value: any): value is RenamableNode {
    return (
      has(value, 'setName') &&
      isFunction(value.setName) &&
      (has(value, 'toString') && isFunction(value.toString) && value.toString !== Object.toString)
    );
  }

  private static cloneTreeShallow(origin: Tree): Tree {
    const tree = new Tree(Object.assign({}, origin.node));
    tree._children = origin._children;
    return tree;
  }

  private static applyNewValueToRenamable(value: RenamableNode, newValue: string): RenamableNode {
    const renamableValue: RenamableNode = Object.assign({}, value as RenamableNode);
    renamableValue.setName(newValue);
    return renamableValue;
  }

  hasDeferredChildren(): boolean {
    return typeof this._loadChildren === 'function';
  }

  /* Setting the children loading state to Loading since a request was dispatched to the client */
  loadingChildrenRequested(): void {
    this._childrenLoadingState = ChildrenLoadingState.Loading;
  }

  /**
   * Check whether children of the node are being loaded.
   * Makes sense only for nodes that define `loadChildren` function.
   * return A flag indicating that children are being loaded.
   */
  childrenAreBeingLoaded(): boolean {
    return this._childrenLoadingState === ChildrenLoadingState.Loading;
  }

  /**
   * Check whether children of the node were loaded.
   * Makes sense only for nodes that define `loadChildren` function.
   * return A flag indicating that children were loaded.
   */
  childrenWereLoaded(): boolean {
    return this._childrenLoadingState === ChildrenLoadingState.Completed;
  }

  /**
   * Check whether children of the node should be loaded and not loaded yet.
   * Makes sense only for nodes that define `loadChildren` function.
   * return A flag indicating that children should be loaded for the current node.
   */
  childrenShouldBeLoaded(): boolean {
    return !this.childrenWereLoaded() && (!!this._loadChildren || this.node.emitLoadNextLevel === true);
  }

  /**
   * By calling this method you start process of loading node's children using `loadChildren` function.
   */
  reloadChildren(): void {
    if (this.childrenShouldBeLoaded()) {
      this._childrenLoadingState = ChildrenLoadingState.Loading;
      this._loadChildren((children: TreeModel[]) => {
        this._children = children && children.map((child: TreeModel) => new Tree(child, this));
        this._childrenLoadingState = ChildrenLoadingState.Completed;
      });
    }
  }

  /**
   * By calling this method you will remove all current children of a treee and create new.
   */
  setChildren(children: Array<TreeModel>): void {
    this._children = children && children.map((child: TreeModel) => new Tree(child, this));
    if (this.childrenShouldBeLoaded()) {
      this._childrenLoadingState = ChildrenLoadingState.Completed;
    }
  }

  /**
   * Create a new node in the current tree.
   * @paramisBranch - A flag that indicates whether a new node should be a "Branch". "Leaf" node will be created by default
   * @parammodel - Tree model of the new node which will be inserted. Empty node will be created by default and it will fire edit mode of this node
   * return A newly created child node.
   */
  createNode(isBranch: boolean, model: TreeModel = {value: ''}): Tree {
    const tree = new Tree(model, this, isBranch);
    if (!model.id) {
      tree.markAsNew();
    }

    tree.id = tree.id || uuidv4();

    if (this.childrenShouldBeLoaded() && !(this.childrenAreBeingLoaded() || this.childrenWereLoaded())) {
      return null;
    }
    if (this.isLeaf()) {
      return this.addSibling(tree);
    } else {
      return this.addChild(tree);
    }
  }

  hasLoadedChildern() {
    return !isEmpty(this.children);
  }

  loadedChildrenAmount() {
    return size(this.children);
  }

  checkedChildrenAmount() {
    return size(this.checkedChildren);
  }

  /**
   * Add a sibling node for the current node. This won't work if the current node is a root.
   * return A newly inserted sibling, or null if you are trying to make a sibling for the root.
   * @paramsibling - A node that should become a sibling.
   * @param position - Position in which sibling will be inserted. By default it will be inserted at the last position in a parent.
   */
  addSibling(sibling: Tree, position?: number): Tree {
    if (Array.isArray(get(this.parent, 'children'))) {
      return this.parent.addChild(sibling, position);
    }
    return null;
  }

  /**
   * Add a child node for the current node.
   * @paramchild - A node that should become a child.
   * @param position - Position in which child will be inserted. By default it will be inserted at the last position in a parent.
   * return A newly inserted child.
   */
  addChild(child: Tree, position?: number): Tree {
    const newborn = this._addChild(Tree.cloneTreeShallow(child), position);

    this._setFoldingType();
    if (this.isNodeCollapsed()) {
      this.switchFoldingType();
    }

    return newborn;
  }

  /**
   * Swap position of the current node with the given sibling. If node passed as a parameter is not a sibling - nothing happens.
   * @paramsibling - A sibling with which current node shold be swapped.
   */
  swapWithSibling(sibling: Tree): void {
    if (!this.hasSibling(sibling)) {
      return;
    }

    const siblingIndex = sibling.positionInParent;
    const thisTreeIndex = this.positionInParent;

    this.parent._children[siblingIndex] = this;
    this.parent._children[thisTreeIndex] = sibling;
  }

  /**
   * Check whether or not this tree is static.
   * return A flag indicating whether or not this tree is static.
   */
  isStatic(): boolean {
    return get(this.node.settings, 'static', false);
  }

  /**
   * Check whether or not this tree has a left menu.
   * return A flag indicating whether or not this tree has a left menu.
   */
  hasLeftMenu(): boolean {
    return !get(this.node.settings, 'static', false) && get(this.node.settings, 'leftMenu', false);
  }

  /**
   * Check whether or not this tree has a right menu.
   * return A flag indicating whether or not this tree has a right menu.
   */
  hasRightMenu(): boolean {
    return !get(this.node.settings, 'static', false) && get(this.node.settings, 'rightMenu', false);
  }

  /**
   * Check whether this tree is "Leaf" or not.
   * return A flag indicating whether or not this tree is a "Leaf".
   */
  isLeaf(): boolean {
    return !this.isBranch();
  }

  /**
   * Check whether or not this tree has a custom menu.
   * return A flag indicating whether or not this tree has a custom menu.
   */
  hasCustomMenu(): boolean {
    return !this.isStatic() && !!get(this.node.settings, 'menuItems', false);
  }

  /**
   * Check whether this tree is "Branch" or not. "Branch" is a node that has children.
   * return A flag indicating whether or not this tree is a "Branch".
   */
  isBranch(): boolean {
    return this.node.emitLoadNextLevel === true || Array.isArray(this._children);
  }

  /**
   * Check whether this tree has children.
   * return A flag indicating whether or not this tree has children.
   */
  hasChildren(): boolean {
    return !isEmpty(this._children) || this.childrenShouldBeLoaded();
  }

  /**
   * Check whether this tree is a root or not. The root is the tree (node) that doesn't have parent (or technically its parent is null).
   * return A flag indicating whether or not this tree is the root.
   */
  isRoot(): boolean {
    return isNil(this.parent);
  }

  /**
   * Check whether provided tree is a sibling of the current tree. Sibling trees (nodes) are the trees that have the same parent.
   * @param tree - A tree that should be tested on a siblingness.
   * return A flag indicating whether or not provided tree is the sibling of the current one.
   */
  hasSibling(tree: Tree): boolean {
    return !this.isRoot() && includes(this.parent.children, tree);
  }

  /**
   * Check whether provided tree is a child of the current tree.
   * This method tests that provided tree is a <strong>direct</strong> child of the current tree.
   * @param tree - A tree that should be tested (child candidate).
   * return A flag indicating whether provided tree is a child or not.
   */
  hasChild(tree: Tree): boolean {
    return includes(this._children, tree);
  }

  /**
   * Remove given tree from the current tree.
   * The given tree will be removed only in case it is a direct child of the current tree (@see {@link hasChild}).
   * @param tree - A tree that should be removed.
   */
  removeChild(tree: Tree): void {
    if (!this.hasChildren()) {
      return;
    }

    const childIndex = this._children.findIndex((child: Tree) => child === tree);
    if (childIndex >= 0) {
      this._children.splice(childIndex, 1);
    }
    this._setFoldingType();
  }

  /**
   * Remove current tree from its parent.
   */
  removeItselfFromParent(): void {
    if (!this.parent) {
      return;
    }

    this.parent.removeChild(this);
  }

  /**
   * Switch folding type of the current tree. "Leaf" node cannot switch its folding type cause it doesn't have children, hence nothing to fold.
   * If node is a "Branch" and it is expanded, then by invoking current method state of the tree should be switched to "collapsed" and vice versa.
   */
  switchFoldingType(): void {
    if (this.isLeaf() || !this.hasChildren()) {
      return;
    }

    this.disableCollapseOnInit();

    this.node._foldingType = this.isNodeExpanded() ? FoldingType.Collapsed : FoldingType.Expanded;
  }

  /**
   * Check that tree is expanded.
   * return A flag indicating whether current tree is expanded. Always returns false for the "Leaf" tree and for an empty tree.
   */
  isNodeExpanded(): boolean {
    return this.foldingType === FoldingType.Expanded;
  }

  /**
   * Check that tree is collapsed.
   * return A flag indicating whether current tree is collapsed. Always returns false for the "Leaf" tree and for an empty tree.
   */
  isNodeCollapsed(): boolean {
    return this.foldingType === FoldingType.Collapsed;
  }

  disableCollapseOnInit() {
    if (this.node.settings) {
      this.node.settings.isCollapsedOnInit = false;
    }
  }

  isCollapsedOnInit() {
    return !!get(this.node.settings, 'isCollapsedOnInit');
  }

  /**
   * Check that current tree is newly created (added by user via menu for example). Tree that was built from the TreeModel is not marked as new.
   * return A flag whether the tree is new.
   */
  isNew(): boolean {
    return this.node._status === TreeStatus.New;
  }

  /**
   * Mark current tree as new (@see {@link isNew}).
   */
  markAsNew(): void {
    this.node._status = TreeStatus.New;
  }

  /**
   * Check that current tree is being renamed (it is in the process of its value renaming initiated by a user).
   * return A flag whether the tree is being renamed.
   */
  isBeingRenamed(): boolean {
    return this.node._status === TreeStatus.IsBeingRenamed;
  }

  /**
   * Mark current tree as being renamed (@see {@link isBeingRenamed}).
   */
  markAsBeingRenamed(): void {
    this.node._status = TreeStatus.IsBeingRenamed;
  }

  /**
   * Check that current tree is modified (for example it was renamed).
   * return A flag whether the tree is modified.
   */
  isModified(): boolean {
    return this.node._status === TreeStatus.Modified;
  }

  /**
   * Mark current tree as modified (@see {@link isModified}).
   */
  markAsModified(): void {
    this.node._status = TreeStatus.Modified;
  }

  /**
   * Makes a clone of an underlying TreeModel instance
   * return a clone of an underlying TreeModel instance
   */
  toTreeModel(): TreeModel {
    const model = defaultsDeep(this.isLeaf() ? {} : {children: []}, this.node);

    if (this.children) {
      this.children.forEach(child => {
        model.children.push(child.toTreeModel());
      });
    }

    return model;
  }

  private buildTreeFromModel(model: TreeModel, parent: Tree, isBranch: boolean): void {
    this.parent = parent;
    this.node = Object.assign(
      omit(model, 'children') as TreeModel,
      {settings: TreeModelSettings.merge(model, get(parent, 'node'))},
      {emitLoadNextLevel: model.emitLoadNextLevel === true}
    ) as TreeModel;

    if (isFunction(this.node.loadChildren)) {
      this._loadChildren = this.node.loadChildren;
    } else {
      get(model, 'children', []).forEach((child: TreeModel, index: number) => {
        this._addChild(new Tree(child, this), index);
      });
    }

    if (!Array.isArray(this._children)) {
      this._children = this.node.loadChildren || isBranch ? [] : null;
    }
  }

  private canLoadChildren(): boolean {
    return (
      this._childrenLoadingState === ChildrenLoadingState.NotStarted &&
      this.foldingType === FoldingType.Expanded &&
      !!this._loadChildren
    );
  }

  private _addChild(child: Tree, position: number = size(this._children) || 0): Tree {
    child.parent = this;

    if (Array.isArray(this._children)) {
      this._children.splice(position, 0, child);
    } else {
      this._children = [child];
    }

    return child;
  }

  /**
   * Set a current folding type: expanded, collapsed or leaf.
   */
  private _setFoldingType(): void {
    if (this.childrenShouldBeLoaded()) {
      this.node._foldingType = FoldingType.Collapsed;
    } else if (this._children && !isEmpty(this._children)) {
      this.node._foldingType = this.isCollapsedOnInit() ? FoldingType.Collapsed : FoldingType.Expanded;
    } else if (Array.isArray(this._children)) {
      this.node._foldingType = FoldingType.Empty;
    } else {
      this.node._foldingType = FoldingType.Leaf;
    }
  }

  private getCssClassesFromSettings(): string {
    if (!this.node._foldingType) {
      this._setFoldingType();
    }

    if (this.node._foldingType === FoldingType.Collapsed) {
      return get(this.node.settings, 'cssClasses.collapsed', null);
    } else if (this.node._foldingType === FoldingType.Expanded) {
      return get(this.node.settings, 'cssClasses.expanded', null);
    } else if (this.node._foldingType === FoldingType.Empty) {
      return get(this.node.settings, 'cssClasses.empty', null);
    }

    return get(this.node.settings, 'cssClasses.leaf', null);
  }

  private getTemplateFromSettings(): string {
    if (this.isLeaf()) {
      return get(this.node.settings, 'templates.leaf', '');
    } else {
      return get(this.node.settings, 'templates.node', '');
    }
  }
}
