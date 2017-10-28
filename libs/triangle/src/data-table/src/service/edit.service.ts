import { Injectable, EventEmitter } from '@angular/core';
import { isPresent } from '../utils';
import { FormGroup } from '@angular/forms';
const isEqual = function(index) {
  return function(item) {
    return item.index === index;
  };
};
const isNotEqual = function(index) {
  return function(item) {
    return item.index !== index;
  };
};
const isNewRow = function(index) {
  return index === -1 || index === undefined;
};
export type Entity = {
  index: number;
  group: any;
};
export type CommandAction = 'edit' | 'remove' | 'cancel' | 'save' | 'add';
export type CommandEvent = {
  action: CommandAction;
  formGroup?: FormGroup;
  isNew?: boolean;
  rowIndex?: number;
};
@Injectable()
export class EditService {
  changes: EventEmitter<CommandEvent>;
  private editedIndices;
  private newItemGroup;
  constructor() {
    this.changes = new EventEmitter();
    this.editedIndices = [];
  }
  editRow(index: number, group?: any): void {
    this.editedIndices.push({ index, group });
  }
  addRow(group: any): void {
    this.newItemGroup = { group };
  }
  get hasNewItem(): boolean {
    return isPresent(this.newItemGroup);
  }
  get newDataItem(): any {
    if (this.hasNewItem) {
      return this.newItemGroup.group.value;
    }
    return {};
  }
  close(index?: number): void {
    if (isNewRow(index)) {
      this.newItemGroup = undefined;
      return;
    }
    this.editedIndices = this.editedIndices.filter(isNotEqual(index));
  }
  context(index?: number): Entity {
    if (isNewRow(index)) {
      return this.newItemGroup;
    }
    return this.editedIndices.find(isEqual(index));
  }
  isEdited(index: number): boolean {
    return isPresent(this.context(index));
  }
  beginEdit(rowIndex: number): void {
    this.changes.emit({ action: 'edit', rowIndex });
  }
  beginAdd(): void {
    this.changes.emit({ action: 'add' });
  }
  endEdit(rowIndex?: number): void {
    const formGroup = this.context(rowIndex).group;
    this.changes.emit({ action: 'cancel', rowIndex, formGroup, isNew: isNewRow(rowIndex) });
  }
  save(rowIndex?: number): void {
    const formGroup = this.context(rowIndex).group;
    this.changes.emit({ action: 'save', rowIndex, formGroup, isNew: isNewRow(rowIndex) });
  }
  remove(rowIndex: number): void {
    this.changes.emit({ action: 'remove', rowIndex });
  }
}
