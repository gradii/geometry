/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { SelectionMode } from './selection-mode';

/**
 * The selectable settings of the TreeView component.
 *
 * @example
 * ```ts
 *
 * _@Component({
 *    selector: 'my-app',
 *    template: `
 *        <tri-treeview
 *          [nodes]="data"
 *
 *          [kendoTreeViewSelectable]="{ mode: 'multiple' }"
 *
 *          kendoTreeViewExpandable
 *          kendoTreeViewHierarchyBinding
 *          childrenField="items"
 *          textField="text"
 *        >
 *        </tri-treeview>
 *        <i>Press ENTER key or use mouse click to select an item</i>
 *    `
 * })
 *
 * class AppComponent {
 *   public data: any[] = [
 *   {
 *     text: "Furniture", items: [
 *       { text: "Tables & Chairs" },
 *       { text: "Sofas" },
 *       {
 *         text: "Occasional Furniture", items: [{
 *           text: "Decor", items: [
 *             { text: "Bed Linen" },
 *             { text: "Curtains & Blinds" },
 *             { text: "Carpets" }
 *           ]
 *         }]
 *       }
 *     ]
 *   }
 *   ];
 * }
 *
 * ```
 */
export interface SelectableSettings {
  /**
   * Determines if a node selection is allowed.
   * Defaults to `true`.
   */
  enabled?: boolean;
  /**
   * The available values are:
   * * (Default) `"single"`
   * * `"multiple"`
   */
  mode?: SelectionMode;
}

