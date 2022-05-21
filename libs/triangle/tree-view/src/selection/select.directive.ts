/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { TreeViewComponent } from '../treeview.component';
import { Subscription } from 'rxjs';
import { TreeItem } from '../treeitem.interface';
import { isBoolean, isPresent, noop } from '../utils';
import { isChanged } from '../helper/changes';

@Directive({selector: '[triTreeViewSelectable]'})
export class SelectDirective implements OnDestroy, OnChanges {
  treeView: TreeViewComponent;
  @Input('selectBy')
  selectKey: string | ((context: TreeItem) => any);
  @Input('kendoTreeViewSelectable')
  selection: any;
  @Input()
  selectedKeys: any[];
  @Output()
  selectedKeysChange: EventEmitter<any[]>;
  subscriptions: Subscription;
  selectActions: any;
  state: any;
  lastChange: any;

  constructor(treeView: TreeViewComponent) {
    this.treeView = treeView;
    /**
     * Fires when the `selectedKeys` collection was updated.
     */
    this.selectedKeysChange = new EventEmitter();
    this.subscriptions = new Subscription();
    this.selectActions = {
      'multiple': (e) => this.selectMultiple(e),
      'single'  : (e) => this.selectSingle(e)
    };
    /**
     * Reflectes the internal `selectedKeys` state.
     */
    this.state = new Set();
    this.subscriptions.add(this.treeView.selectionChange.subscribe(this.select.bind(this)));
    this.treeView.isSelected = (dataItem, index) => (this.state.has(
      this.itemKey({dataItem, index})));
  }

  /**
   * @hidden
   */
  @Input()
  set isSelected(value: (item: object, index: string) => boolean) {
    this.treeView.isSelected = value;
  }

  @HostBinding('attr.aria-multiselectable')
  get getAriaMultiselectable(): boolean {
    return this.options.mode === 'multiple';
  }

  get options(): any {
    const defaultOptions = {
      enabled: true,
      mode   : 'single'
    };
    if (!isPresent(this.selection) || typeof this.selection === 'string') {
      return defaultOptions;
    }
    const selectionSettings = isBoolean(
      this.selection) ? {enabled: this.selection} : this.selection;
    return Object.assign(defaultOptions, selectionSettings);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (isChanged('selectedKeys', changes,
      false) && changes.selectedKeys.currentValue !== this.lastChange) {
      this.state = new Set(changes.selectedKeys.currentValue);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  itemKey(e: any) {
    if (!this.selectKey) {
      return e.index;
    }
    if (typeof this.selectKey === 'string') {
      return e.dataItem[this.selectKey];
    }
    if (typeof this.selectKey === 'function') {
      return this.selectKey(e);
    }
  }

  select(e: any) {
    const {enabled, mode}  = this.options;
    const performSelection = this.selectActions[mode] || noop;
    if (!enabled) {
      return;
    }
    performSelection(e);
  }

  selectSingle(node: any) {
    const key = this.itemKey(node);
    if (!this.state.has(key)) {
      this.state.clear();
      this.state.add(key);
      this.notify();
    }
  }

  selectMultiple(node: any) {
    const key        = this.itemKey(node);
    const isSelected = this.state.has(key);
    if (!isPresent(key)) {
      return;
    }
    if (isSelected) {
      this.state.delete(key);
    } else {
      this.state.add(key);
    }
    this.notify();
  }

  notify(): any {
    this.lastChange = Array.from(this.state);
    this.selectedKeysChange.emit(this.lastChange);
  }
}
