/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { NavigationService } from './navigation/navigation.service';
import { SelectionService } from './selection/selection.service';
import { ExpandStateService } from './expand-state.service';
import { IndexBuilderService } from './index-builder.service';
import { TreeViewLookupService } from './treeview-lookup.service';
import { TreeItem } from './treeitem.interface';
import { CheckedState } from './checkbox/checked-state';
import { isPresent } from './utils';
import { filter } from 'rxjs/operators';
import { anyChanged } from './helper/changes';

export const buildItem = (index, dataItem) => ({dataItem, index});
let id                 = 0;
const TREE_ITEM_ROLE   = 'treeitem';
const BUTTON_ROLE      = 'button';

@Directive({selector: '[triTreeViewItem]'})
export class TreeViewItemDirective implements OnInit, OnChanges, OnDestroy {
  element: any;
  expandService: any;
  navigationService: any;
  selectionService: any;
  lookupService: any;
  renderer: any;
  ib: any;
  @Input()
  dataItem: any;
  @Input()
  index: string;
  @Input()
  parentDataItem: any;
  @Input()
  parentIndex: string;
  @Input()
  role: string;
  @Input()
  loadOnDemand: boolean;
  @Input()
  checkable: boolean;
  @Input()
  selectable: boolean;
  @Input()
  expandable: boolean;
  @Input()
  isDisabled: boolean;
  @Input()
  isVisible: boolean;
  ariaChecked: string;
  readonly id: number;
  _isExpanded: any;
  _isSelected: any;
  isInitialized: any;
  subscriptions: any;

  constructor(element: ElementRef, expandService: ExpandStateService,
              navigationService: NavigationService, selectionService: SelectionService,
              lookupService: TreeViewLookupService, renderer: Renderer2, ib: IndexBuilderService) {
    this.element           = element;
    this.expandService     = expandService;
    this.navigationService = navigationService;
    this.selectionService  = selectionService;
    this.lookupService     = lookupService;
    this.renderer          = renderer;
    this.ib                = ib;
    this.role              = TREE_ITEM_ROLE;
    this.loadOnDemand      = true;
    this.isDisabled        = false;
    this.isVisible         = true;
    this.ariaChecked       = 'false';
    this.id                = id++;
    this.isInitialized     = false;
    this.subscriptions     = [];
    this.subscribe();
  }

  @Input()
  set isChecked(checked: CheckedState) {
    if (checked === 'checked') {
      this.ariaChecked = 'true';
    } else if (checked === 'indeterminate') {
      this.ariaChecked = 'mixed';
    } else {
      this.ariaChecked = 'false';
    }
  }

  @Input()
  get isExpanded(): boolean {
    return this._isExpanded || false;
  }

  set isExpanded(isExpanded: boolean) {
    this._isExpanded = isExpanded;
  }

  @Input()
  get isSelected(): boolean {
    return this._isSelected || false;
  }

  set isSelected(isSelected: boolean) {
    this._isSelected = isSelected;
  }

  get isButton(): boolean {
    return this.role === BUTTON_ROLE;
  }

  get treeItem(): TreeItem {
    return buildItem(this.index, this.dataItem);
  }

  get parentTreeItem(): TreeItem {
    return this.parentDataItem ? buildItem(this.parentIndex, this.parentDataItem) : null;
  }

  ngOnInit() {
    if (this.loadOnDemand && !this.isButton) {
      this.lookupService.registerItem(this.treeItem, this.parentTreeItem);
    }
    this.registerNavigationItem();
    this.isInitialized = true;
    this.setAttribute('role', this.role);
    this.setAriaAttributes();
    this.setDisabledClass();
    this.updateTabIndex();
  }

  ngOnChanges(changes: SimpleChanges) {
    const {index, isDisabled} = changes;
    if (anyChanged(
      [
        'index', 'checkable', 'isChecked', 'expandable', 'isExpanded', 'selectable', 'isSelected'
      ],
      changes)) {
      this.setAriaAttributes();
    }
    if (isDisabled) {
      this.setDisabledClass();
    }
    if (this.loadOnDemand && !this.isButton) {
      this.moveLookupItem(changes);
    }
    this.moveNavigationItem(index);
    if (anyChanged(['isDisabled', 'isVisible'], changes)) {
      this.updateNodeAvailability();
    }
  }

  ngOnDestroy() {
    this.navigationService.unregisterItem(this.id, this.index);
    if (this.loadOnDemand && !this.isButton) {
      this.lookupService.unregisterItem(this.index, this.dataItem);
    }
    this.subscriptions = this.subscriptions.reduce(
      (list, callback) => (callback.unsubscribe(), list), []);
  }

  subscribe() {
    this.subscriptions = [
      this.navigationService.moves
        .subscribe(() => {
          this.updateTabIndex();
          this.focusItem();
        }),
      this.navigationService.expands
        .pipe(filter(({index}) => index === this.index && !this.isDisabled))
        .subscribe(({expand}) => this.expand(expand))
    ];
  }

  registerNavigationItem(): any {
    this.navigationService.registerItem(this.id, this.index, this.isDisabled, this.isButton,
      this.isVisible);
    this.activateItem();
  }

  activateItem(): any {
    if (this.isDisabled) {
      return;
    }
    const navigationService = this.navigationService;
    const selectionService  = this.selectionService;
    const index             = this.index;
    selectionService.setFirstSelected(index, this.isSelected);
    if (!navigationService.isActive(index) && selectionService.isFirstSelected(index)) {
      navigationService.activateIndex(index);
    }
  }

  expand(shouldExpand): any {
    this.expandService[shouldExpand ? 'expand' : 'collapse'](this.index, this.dataItem);
  }

  isFocusable(): any {
    return !this.isDisabled && this.navigationService.isFocusable(this.index);
  }

  focusItem(): any {
    if (this.isInitialized && this.navigationService.isActive(this.index)) {
      this.element.nativeElement.focus();
    }
  }

  moveLookupItem(changes = {}): any {
    const {dataItem, index, parentDataItem, parentIndex} = changes;
    if ((index && index.firstChange) || // skip first change
      (!dataItem && !index && !parentDataItem && !parentIndex)) {
      return;
    }
    const oldIndex = (index || {}).previousValue || this.index;
    this.lookupService.replaceItem(oldIndex, this.treeItem, this.parentTreeItem);
  }

  moveNavigationItem(indexChange: any = {}): any {
    const {currentValue, firstChange, previousValue} = indexChange as SimpleChange;
    if (!firstChange && isPresent(currentValue) && isPresent(previousValue)) {
      this.navigationService.unregisterItem(this.id, previousValue);
      this.navigationService.registerItem(this.id, currentValue, this.isDisabled, this.isButton);
    }
  }

  updateNodeAvailability(): any {
    const service = this.navigationService;
    if (this.isDisabled || !this.isVisible) {
      service.activateClosest(this.index); // activate before unregister the item
    } else {
      service.activateFocusable();
    }
    service.unregisterItem(this.id, this.index);
    service.registerItem(this.id, this.index, this.isDisabled, this.isButton, this.isVisible);
  }

  setAriaAttributes(): any {
    this.setAttribute('aria-level', this.ib.level(this.index).toString());
    // don't render attributes when the component configuration doesn't allow the specified state
    this.setAttribute('aria-expanded', this.expandable ? this.isExpanded.toString() : null);
    this.setAttribute('aria-selected', this.selectable ? this.isSelected.toString() : null);
    this.setAttribute('aria-checked', this.checkable ? this.ariaChecked : null);
  }

  setDisabledClass(): any {
    this.setClass('k-disabled', this.isDisabled);
  }

  setClass(className, toggle): any {
    const action = toggle ? 'addClass' : 'removeClass';
    this.renderer[action](this.element.nativeElement, className);
  }

  updateTabIndex(): any {
    this.setAttribute('tabIndex', this.isFocusable() ? '0' : '-1');
  }

  setAttribute(attr, value): any {
    if (!isPresent(value)) {
      this.renderer.removeAttribute(this.element.nativeElement, attr);
      return;
    }
    this.renderer.setAttribute(this.element.nativeElement, attr, value);
  }
}
