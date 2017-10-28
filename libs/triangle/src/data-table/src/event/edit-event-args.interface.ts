import { DataTableComponent } from '../data-table.component';

export interface EditEvent {
  dataItem: any;

  isNew: boolean;

  rowIndex: number;

  sender: DataTableComponent;
}
