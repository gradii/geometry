import { ColumnBase } from '../columns/column-base';

/**
 * @hidden
 */
export type DragAndDropContext = {
  field?: string;
  hint?: string;
  lastTarget?: boolean;
  lastColumn?: boolean;
  column?: ColumnBase;
  type: 'column' | 'groupIndicator' | 'columnGroup';
};
