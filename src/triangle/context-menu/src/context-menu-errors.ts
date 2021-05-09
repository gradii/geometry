/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


/**
 * Throws an exception for the case when menu trigger doesn't have a valid tri-context-menu instance
 * @docs-private
 */
export function throwTriContextMenuMissingError() {
  throw Error(`triContextMenuTriggerFor: must pass in an tri-context-menu instance.

    Example:
      <tri-context-menu #menu="triContextMenu"></tri-context-menu>
      <button [triContextMenuTriggerFor]="menu"></button>`);
}

/**
 * Throws an exception for the case when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * @docs-private
 */
export function throwTriContextMenuInvalidPositionX() {
  throw Error(`xPosition value must be either 'before' or after'.
      Example: <tri-context-menu xPosition="before" #menu="triContextMenu"></tri-context-menu>`);
}

/**
 * Throws an exception for the case when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * @docs-private
 */
export function throwTriContextMenuInvalidPositionY() {
  throw Error(`yPosition value must be either 'above' or below'.
      Example: <tri-context-menu yPosition="above" #menu="triContextMenu"></tri-context-menu>`);
}


/**
 * Throws an exception for the case when a menu is assigned
 * to a trigger that is placed inside the same menu.
 * @docs-private
 */
export function throwTriContextMenuRecursiveError() {
  throw Error(`triContextMenuTriggerFor: menu cannot contain its own trigger. Assign a menu that is ` +
              `not a parent of the trigger or move the trigger outside of the menu.`);
}
