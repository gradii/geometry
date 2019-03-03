import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'tri-row-expand-icon',
  template: ``
})
export class RowExpandIconComponent {
  @Input() expand = false;

  @Input()
  @HostBinding('class.tri-table-row-spaced')
  showExpand = false;

  @Output() expandChange = new EventEmitter();

  @HostBinding(`class.tri-table-row-expanded`)
  get expanded() {
    return this.expand && !this.showExpand;
  }

  @HostBinding(`class.tri-table-row-collapsed`)
  get collapsed() {
    return !this.expand && !this.showExpand;
  }

  @HostBinding(`class.tri-table-row-expand-icon`)
  _expandIcon = true;

  @HostListener('click')
  onClick() {
    this.expand = !this.expand;
    this.expandChange.emit(this.expand);
  }

  constructor() {}
}
