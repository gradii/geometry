/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NodeMenuItem } from './menu/node-menu.component';
import { defaultsDeep, get, omit } from './utils/fn.utils';

export class FoldingType {
  static Expanded: FoldingType = new FoldingType('node-expanded');
  static Collapsed: FoldingType = new FoldingType('node-collapsed');
  static Empty: FoldingType = new FoldingType('node-empty');
  static Leaf: FoldingType = new FoldingType('node-leaf');

  constructor(private _cssClass: string) {}

  get cssClass(): string {
    return this._cssClass;
  }
}

export type ChildrenLoadingFunction = (callback: (children: TreeModel[]) => void) => void;

export interface TreeModel {
  value: string | RenamableNode;
  id?: string | number;
  children?: TreeModel[];
  loadChildren?: ChildrenLoadingFunction;
  settings?: TreeModelSettings;
  emitLoadNextLevel?: boolean;
  _status?: TreeStatus;
  _foldingType?: FoldingType;

  [additionalData: string]: any;
}

export interface CssClasses {
  /* The class or classes that should be added to the expanded node */
  expanded?: string;

  /* The class or classes that should be added to the collapsed node */
  collapsed?: string;

  /* The class or classes that should be added to the empty node */
  empty?: string;

  /* The class or classes that should be added to the expanded to the leaf */
  leaf?: string;
}

export interface Templates {
  /* A template for a node */
  node?: string;

  /* A template for a leaf node */
  leaf?: string;

  /* A template for left menu html element */
  leftMenu?: string;
}

export class TreeModelSettings {
  static readonly NOT_CASCADING_SETTINGS = ['selectionAllowed'];
  /* cssClasses - set custom css classes which will be used for a tree */
  cssClasses?: CssClasses;
  /* Templates - set custom html templates to be used in a tree */
  templates?: Templates;
  /**
   * "leftMenu" property when set to true makes left menu available.
   * @name TreeModelSettings#leftMenu
   * @default false
   */
  leftMenu?: boolean;
  /**
   * "rightMenu" property when set to true makes right menu available.
   * @name TreeModelSettings#rightMenu
   * @default true
   */
  rightMenu?: boolean;
  /**
   * "menu" property when set will be available as custom context menu.
   * @name TreeModelSettings#MenuItems
   * @type NodeMenuItem
   */
  menuItems?: NodeMenuItem[];
  /**
   * "static" property when set to true makes it impossible to drag'n'drop tree or call a menu on it.
   * @name TreeModelSettings#static
   * @default false
   */
  static?: boolean;
  isCollapsedOnInit?: boolean;
  checked?: boolean;
  selectionAllowed?: boolean;

  static merge(child: TreeModel, parent: TreeModel): TreeModelSettings {
    const parentCascadingSettings = omit(get(parent, 'settings'), TreeModelSettings.NOT_CASCADING_SETTINGS);
    return defaultsDeep({}, get(child, 'settings'), parentCascadingSettings, {
      static           : false,
      leftMenu         : false,
      rightMenu        : true,
      isCollapsedOnInit: false,
      checked          : false,
      selectionAllowed : true
    });
  }
}

export class Ng2TreeSettings {
  /**
   * Indicates root visibility in the tree. When true - root is invisible.
   * @name Ng2TreeSettings#rootIsVisible
   */
  rootIsVisible ? = true;
  showCheckboxes ? = false;
  enableCheckboxes ? = true;
}

export enum TreeStatus {
  New,
  Modified,
  IsBeingRenamed
}

export interface RenamableNode {
  /**
   * Set new value of the renamable node. Implementation of this method is up to user.
   * @param {string} name - A new value of the node.
   */
  setName(name: string): void;

  /**
   * Get string representation of the node. Implementation of this method is up to user.
   * @returns {string} - A node string representation.
   */
  toString(): string;
}
