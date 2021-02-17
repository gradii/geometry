/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export type SelectableMode = 'single' | 'multiple';

export type SelectAllCheckboxState = 'checked' | 'unchecked' | 'indeterminate';

export interface SelectableSettings {
  /**
   * Determines if row selection is allowed.
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * Determines if the selection is performed only through clicking a checkbox.
   * If enabled, clicking the row itself will not select the row.
   * Applicable if at least one checkbox column is present.
   *
   * @default true
   */
  checkboxOnly?: boolean;
  /**
   * The available values are:
   * * `single`
   * * `multiple`
   *
   * @default "multiple"
   */
  mode?: SelectableMode;
}
