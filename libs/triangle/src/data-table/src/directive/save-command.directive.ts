import {Directive, HostListener, HostBinding, Inject} from '@angular/core';
import {EditService} from '../service/edit.service';
import {CELL_CONTEXT, CellContext} from '../cell-context';

@Directive({
  selector: '[triGridSaveCommand], [tri-grid-save-command]'
})
export class SaveCommandDirective {
  private editService;
          rowIndex: number;

  constructor(editService: EditService, @Inject(CELL_CONTEXT) cellContext: CellContext) {
    this.editService = editService;
    this.rowIndex    = cellContext.rowIndex;
  }

  @HostListener('click')
  click(): void {
    this.editService.save(this.rowIndex);
  }

  @HostBinding('style.display')
  get visible() {
    return !this.editService.isEdited(this.rowIndex) ? 'none' : '';
  }

  @HostBinding('class.ant-grid-save-command')
  get commandClass() {
    return true;
  }
}
