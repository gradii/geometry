import { Directive, HostBinding, HostListener } from '@angular/core';
import { EditService } from './../service/edit.service';

@Directive({
  selector: '[triGridAddCommand], [tri-grid-add-command]'
})
export class AddCommandDirective {
  private editService;

  constructor(editService: EditService) {
    this.editService = editService;
  }

  @HostListener('click')
  click() {
    this.editService.beginAdd();
  }

  @HostBinding('class.ant-grid-add-command')
  get commandClass() {
    return true;
  }
}
