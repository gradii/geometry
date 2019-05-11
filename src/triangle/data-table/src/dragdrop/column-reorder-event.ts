import { ColumnBase } from '../columns/column-base';
import { PreventableEvent } from '../event/preventable-event';

/**
 * Arguments for the `columnReorder` event.
 */
export class ColumnReorderEvent extends PreventableEvent {
  /**
   * The reordered column.
   */
  public readonly column: ColumnBase;

  /**
   * The new index of the column.
   * Relative to the collection of columns.
   */
  public readonly newIndex: number;

  /**
   * The original index of the column before reordering.
   * Relative to the collection of columns.
   */
  public readonly oldIndex: number;

  /**
   * @hidden
   */
  constructor({column, newIndex, oldIndex}: any) {
    super();

    this.column = column;
    this.newIndex = newIndex;
    this.oldIndex = oldIndex;
  }
}
