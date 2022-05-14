/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


/** @hidden */
export interface NavigationItem {
  id: number;
  children: NavigationItem[];
  index: string;
  parent: NavigationItem;
  disabled: boolean;
  visible: boolean;
  loadMoreButton: boolean;
}

