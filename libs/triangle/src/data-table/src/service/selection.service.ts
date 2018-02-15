import { Injectable, EventEmitter } from '@angular/core';
import { isPresent } from '../utils';

export interface SelectionEvent {
  index: number;

  selected: boolean;
}
@Injectable()
export class SelectionService {
  changes: EventEmitter<SelectionEvent>;
  private selectedIndices;
  constructor() {
    this.changes = new EventEmitter();
    this.selectedIndices = [];
  }
  isSelected(index: number): boolean {
    return isPresent(this.selectedIndices.find(current => current === index));
  }
  select(index: number): void {
    if (!this.isSelected(index)) {
      this.selectedIndices = [index];
      this.changes.emit({ index, selected: true });
    }
  }
  unselect(index: number): void {
    if (this.isSelected(index)) {
      this.selectedIndices = [];
      this.changes.emit({ index, selected: false });
    }
  }
  toggle(index: number): void {
    if (this.isSelected(index)) {
      this.unselect(index);
      return;
    }
    this.select(index);
  }
  get selected() {
    return this.selectedIndices;
  }
}
