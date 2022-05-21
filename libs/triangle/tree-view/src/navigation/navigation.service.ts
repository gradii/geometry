/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Subject } from 'rxjs';
import { Keys } from '../helper/keys';
import { NavigationItem } from './navigation-item.interface';
import { NavigationModel } from './navigation-model';
import { NavigationState } from './navigation-state.interface';
import { Injectable } from '@angular/core';
import { isPresent, nodeIndex } from '../utils';

@Injectable()
export class NavigationService {
  localization: any;
  readonly expands: Subject<NavigationState>;
  readonly moves: Subject<NavigationState>;
  readonly checks: Subject<string>;
  readonly selects: Subject<string>;
  readonly loadMore: Subject<string>;
  navigable: boolean;
  actions: {[x: string]: Function; };
  activeItem: any;
  isFocused: any;
  _model: any;

  constructor(/*localization: LocalizationService*/) {
    // this.localization = localization;
    this.expands = new Subject();
    this.moves = new Subject();
    this.checks = new Subject();
    this.selects = new Subject();
    this.loadMore = new Subject();
    this.navigable = true;
    this.actions = {
      [Keys.ArrowUp]: () => this.activate(this.model.findVisiblePrev(this.focusableItem)),
      [Keys.ArrowDown]: () => this.activate(this.model.findVisibleNext(this.focusableItem)),
      [Keys.ArrowLeft]: () => !this.isLoadMoreButton && (this.expand({
        expand: this.localization.rtl,
        intercept: this.localization.rtl ? this.moveToFirstVisibleChild : this.moveToParent
      })),
      [Keys.ArrowRight]: () => !this.isLoadMoreButton && (this.expand({
        expand: !this.localization.rtl,
        intercept: this.localization.rtl ? this.moveToParent : this.moveToFirstVisibleChild
      })),
      [Keys.Home]: () => this.activate(this.model.firstVisibleNode()),
      [Keys.End]: () => this.activate(this.model.lastVisibleNode()),
      [Keys.Enter]: () => this.handleEnter(),
      [Keys.Space]: () => this.handleSpace()
    };
    this.isFocused = false;
    this._model = new NavigationModel();
    this.moveToFirstVisibleChild = this.moveToFirstVisibleChild.bind(this);
    this.moveToParent = this.moveToParent.bind(this);
  }

  get model(): NavigationModel {
    return this._model;
  }

  set model(model: NavigationModel) {
    this._model = model;
  }

  get activeIndex(): any {
    return nodeIndex(this.activeItem) || null;
  }

  get isActiveExpanded(): any {
    return this.activeItem && this.activeItem.children.length > 0;
  }

  get isLoadMoreButton(): any {
    return this.activeItem && this.activeItem.loadMoreButton;
  }

  get focusableItem(): NavigationItem {
    return this.activeItem || this.model.firstFocusableNode();
  }

  activate(item: NavigationItem) {
    if (!this.navigable || !item || this.isActive(nodeIndex(item))) {
      return;
    }
    this.isFocused = true;
    this.activeItem = item || this.activeItem;
    this.notifyMove();
  }

  activateParent(index: string) {
    this.activate(this.model.findParent(index));
  }

  activateIndex(index: string) {
    if (!index) {
      return;
    }
    this.activate(this.model.findNode(index));
  }

  activateClosest(index: string) {
    if (!index || nodeIndex(this.focusableItem) !== index) {
      return;
    }
    this.activeItem = this.model.closestNode(index);
    this.notifyMove();
  }

  activateFocusable() {
    if (this.activeItem) {
      return;
    }
    this.activeItem = this.model.firstVisibleNode();
    this.notifyMove();
  }

  deactivate() {
    if (!this.navigable || !this.isFocused) {
      return;
    }
    this.isFocused = false;
    this.notifyMove();
  }

  checkIndex(index: string) {
    if (!this.isDisabled(index)) {
      this.checks.next(index);
    }
  }

  selectIndex(index: string) {
    if (!this.isDisabled(index)) {
      this.selects.next(index);
    }
  }

  notifyLoadMore(index: string) {
    if (!isPresent(index)) {
      return;
    }
    this.loadMore.next(index);
  }

  isActive(index: string) {
    if (!index) {
      return false;
    }
    return this.isFocused && this.activeIndex === index;
  }

  isFocusable(index: string) {
    return nodeIndex(this.focusableItem) === index;
  }

  isDisabled(index: string) {
    return this.model.findNode(index).disabled;
  }

  registerItem(id: number, index: string, disabled: boolean, loadMoreButton: boolean = false, visible: boolean = true) {
    const itemAtIndex = this.model.findNode(index);
    if (isPresent(itemAtIndex)) {
      this.model.unregisterItem(itemAtIndex.id, itemAtIndex.index);
      if (this.isActive(index)) {
        this.deactivate();
      }
    }
    this.model.registerItem(id, index, disabled, loadMoreButton, visible);
  }

  unregisterItem(id: number, index: string) {
    if (this.isActive(index)) {
      this.activateParent(index);
    }
    this.model.unregisterItem(id, index);
  }

  move(e: any) {
    if (!this.navigable) {
      return;
    }
    const moveAction = this.actions[e.keyCode];
    if (!moveAction) {
      return;
    }
    moveAction();
    e.preventDefault();
  }

  expand({ expand, intercept }): any {
    const index = nodeIndex(this.activeItem);
    if (!index || intercept(index)) {
      return;
    }
    this.notifyExpand(expand);
  }

  moveToParent(): any {
    if (this.isActiveExpanded) {
      return false;
    }
    this.activate(this.model.findParent(nodeIndex(this.activeItem)));
    return true;
  }

  moveToFirstVisibleChild(): any {
    if (!this.isActiveExpanded) {
      return false;
    }
    this.activate(this.model.findVisibleChild(nodeIndex(this.activeItem)));
    return true;
  }

  notifyExpand(expand): any {
    this.expands.next(this.navigationState(expand));
  }

  notifyMove(): any {
    this.moves.next(this.navigationState());
  }

  navigationState(expand = false): any {
    return ({ expand, index: this.activeIndex, isFocused: this.isFocused });
  }

  handleEnter(): any {
    if (!this.navigable) {
      return;
    }
    if (this.isLoadMoreButton) {
      this.notifyLoadMore(this.activeIndex);
    } else {
      this.selectIndex(this.activeIndex);
    }
  }

  handleSpace(): any {
    if (!this.navigable) {
      return;
    }
    if (this.isLoadMoreButton) {
      this.notifyLoadMore(this.activeIndex);
    } else {
      this.checkIndex(this.activeIndex);
    }
  }
}
