import { TreeNodeComponent } from './tree-node.component';
import { TreeService } from './tree.service';

export interface TreeNodeOptions {
  title: string;
  key: string;
  icon?: string;
  isLeaf?: boolean;
  checked?: boolean;
  selected?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  expanded?: boolean;
  children?: TreeNodeOptions[];

  // tslint:disable-next-line:no-any
  [ key: string ]: any;
}

export class TreeNode {
  private _title: string;
  key?: string | null;
  private _icon: string;
  level: number = 0;
  private _children: TreeNode[];
  private _isLeaf: boolean;
  // tslint:disable-next-line:no-any
  origin: any;
  // Parent Node
  parentNode?: TreeNode;
  private _isChecked: boolean;
  private _isSelectable: boolean;
  private _isDisabled: boolean;
  private _isDisableCheckbox: boolean;
  private _isExpanded: boolean;
  private _isHalfChecked: boolean;
  private _isSelected: boolean;
  private _isLoading: boolean;
  private _service?: TreeService;

  component: TreeNodeComponent;
  isMatched: boolean;

  get treeService(): TreeService | undefined {
    if (this._service) {
      return this._service;
    } else if (this.parentNode) {
      return this.parentNode.treeService;
    }
    return undefined;
  }

  constructor(option: TreeNodeOptions | TreeNode, parent?: TreeNode, service?: TreeService) {
    if (option instanceof TreeNode) {
      return option;
    }
    this._service = service;
    this._title = option.title || '---';
    this.key = option.key || undefined;
    this._icon = option.icon || '';
    this._isLeaf = option.isLeaf || false;
    this.origin = option;
    this._children = [];
    this.parentNode = parent;
    // option params
    this._isChecked = option.checked || false;
    this._isSelectable = option.disabled || (option.selectable === false ? false : true);
    this._isDisabled = option.disabled || false;
    this._isDisableCheckbox = option.disableCheckbox || false;
    this._isExpanded = option.isLeaf ? false : (option.expanded || false);
    this._isHalfChecked = false;
    this._isSelected = (!option.disabled && option.selected) || false;
    this._isLoading = false;
    this.isMatched = false;

    /**
     * parent's checked status will affect children while initializing
     */
    if (parent) {
      this.level = parent.level + 1;
    } else {
      this.level = 0;
    }
    if (typeof (option.children) !== 'undefined' && option.children !== null) {
      option.children.forEach(
        (nodeOptions) => {
          const s = this.treeService;
          if ((s && !s.isCheckStrictly) && option.checked && !option.disabled && !nodeOptions.disabled && !nodeOptions.disableCheckbox) {
            nodeOptions.checked = option.checked;
          }
          this._children.push(new TreeNode(nodeOptions, this));
        }
      );
    }
  }

  /**
   * auto generate
   * get
   * set
   */
  get service(): TreeService | undefined {
    return this._service;
  }

  set service(value: TreeService | undefined) {
    this._service = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
    this.update();
  }

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
    this.update();
  }

  get children(): TreeNode[] {
    return this._children;
  }

  set children(value: TreeNode[]) {
    this._children = value;
    this.update();
  }

  get isLeaf(): boolean {
    return this._isLeaf;
  }

  set isLeaf(value: boolean) {
    this._isLeaf = value;
    this.update();
  }

  get isChecked(): boolean {
    return this._isChecked;
  }

  set isChecked(value: boolean) {
    this._isChecked = value;
    this.origin.checked = value;
    this.treeService!.setCheckedNodeList(this);
    this.update();
  }

  get isHalfChecked(): boolean {
    return this._isHalfChecked;
  }

  set isHalfChecked(value: boolean) {
    this._isHalfChecked = value;
    this.treeService!.setHalfCheckedNodeList(this);
    this.update();
  }

  get isSelectable(): boolean {
    return this._isSelectable;
  }

  set isSelectable(value: boolean) {
    this._isSelectable = value;
    this.update();
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  set isDisabled(value: boolean) {
    this._isDisabled = value;
    this.update();
  }

  get isDisableCheckbox(): boolean {
    return this._isDisableCheckbox;
  }

  set isDisableCheckbox(value: boolean) {
    this._isDisableCheckbox = value;
    this.update();
  }

  get isExpanded(): boolean {
    return this._isExpanded;
  }

  set isExpanded(value: boolean) {
    this._isExpanded = value;
    this.origin.expanded = value;
    this.treeService!.setExpandedNodeList(this);
    this.update();
  }

  get isSelected(): boolean {
    return this._isSelected;
  }

  set isSelected(value: boolean) {
    this._isSelected = value;
    this.origin.selected = value;
    this.treeService!.setNodeActive(this);
    this.update();
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
    this.update();
  }

  /**
   * end
   * get
   * set
   */

  public getParentNode(): TreeNode | undefined {
    return this.parentNode;
  }

  public getChildren(): TreeNode[] {
    return this.children;
  }

  /**
   * 支持按索引位置插入,叶子节点不可添加
   */
  // tslint:disable-next-line:no-any
  public addChildren(children: any[], childPos: number = -1): void {
    if (!this.isLeaf) {
      children.forEach(
        (node) => {
          const refreshLevel = (n: TreeNode) => {
            n.getChildren().forEach(c => {
              c.level = c.getParentNode()!.level + 1;
              // flush origin
              c.origin.level = c.level;
              refreshLevel(c);
            });
          };
          let child = node;
          if (child instanceof TreeNode) {
            child.parentNode = this;
          } else {
            child = new TreeNode(node, this);
          }
          child.level = this.level + 1;
          child.origin.level = child.level;
          refreshLevel(child);
          try {
            childPos === -1 ? this.children.push(child) : this.children.splice(childPos, 0, child);
            // flush origin
          } catch (e) {
          }
        });
      this.origin.children = this.getChildren().map(v => v.origin);
      // remove loading state
      this.isLoading = false;
      this.treeService!.triggerEventChange$!.next({
        'eventName': 'addChildren',
        'node'     : this
      });
    }
  }

  public clearChildren(): void {
    this.getChildren().forEach((n) => {
      this.treeService!.afterRemove(n, false);
    });
    this.getChildren().splice(0, this.getChildren().length);
    this.origin.children = [];
    // refresh checked state
    this.treeService!.calcCheckedKeys(this.treeService!.checkedNodeList.map(v => v.key!), this.treeService!.rootNodes, this.treeService!.isCheckStrictly);
    this.update();
  }

  public remove(): void {
    const parentNode = this.getParentNode();
    if (parentNode) {
      const index = parentNode.getChildren().findIndex(n => n.key === this.key);
      parentNode.getChildren().splice(index, 1);
      parentNode.origin.children.splice(index, 1);
      this.treeService!.afterRemove(this);
      this.update();
    }
  }

  public update(): void {
    if (this.component) {
      this.component.setClassMap();
      this.component.markForCheck();
    }
  }
}
