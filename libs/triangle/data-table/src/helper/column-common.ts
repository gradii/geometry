import { isSpanColumnComponent } from '../columns/span-column.component';

export const expandColumns = columns => {
  return columns.reduce((acc, column) => {
    if (isSpanColumnComponent(column)) {
      return acc.concat(column.childColumns.toArray());
    }
    return acc.concat([column]);
  }, []);
};
export const columnsToRender = columns => {
  return expandColumns(columns).filter(x => !x.hidden);
};
export const columnsSpan = columns => {
  return (columns || []).reduce((acc, col) => acc + col.colspan, 0);
};
