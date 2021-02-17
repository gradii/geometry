import { Directive, HostBinding, HostListener, Inject } from '@angular/core';
import { CELL_CONTEXT } from '../cell-context';
import { EditService } from '../service/edit.service';

@Directive({
  selector: '[triGridRemoveCommand], [tri-grid-remove-command]'
})
export class RemoveCommandDirective {
  private editService;
  rowIndex: number;

  constructor(editService: EditService, @Inject(CELL_CONTEXT) cellContext) {
    this.editService = editService;
    this.rowIndex = cellContext.rowIndex;
  }

  @HostListener('click')
  click() {
    this.editService.remove(this.rowIndex);
  }

  @HostBinding('style.display')
  get visible() {
    return this.editService.isEdited(this.rowIndex) ? 'none' : '';
  }

  @HostBinding('class.tri-grid-remove-command')
  get commandClass() {
    return true;
  }
}
