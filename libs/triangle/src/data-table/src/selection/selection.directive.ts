import { Directive, Host, Self } from '@angular/core';
import { Selection } from "./selection-default";
import { DataTableComponent } from '../data-table.component';

/**
 * A directive which stores the row selection state of the Grid in memory.
 */
@Directive({
  selector: 'tri-data-table[selectedBy]'
})
export class SelectionDirective extends Selection {
  constructor(@Host() protected grid: DataTableComponent) {
    super(grid);
  }


  ngOnInit() {
    if (this.grid.selectable === false) {
      this.grid.selectable = true;
    }
    this.grid.selectionDirective = true;
  }


  ngOnDestroy() {
    super.destroy();
  }
}