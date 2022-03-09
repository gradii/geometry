/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Keys } from '@progress/kendo-angular-common';
import { LocalizationService } from '@progress/kendo-angular-l10n';
import { Subject } from 'rxjs';
import { NavigationModel } from './navigation-model';
import { nodeIndex, isPresent } from '../utils';
/**
 * @hidden
 */
let NavigationService = class NavigationService {
    constructor(localization) {
        this.localization = localization;
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
    get model() {
        return this._model;
    }
    set model(model) {
        this._model = model;
    }
    get activeIndex() {
        return nodeIndex(this.activeItem) || null;
    }
    get isActiveExpanded() {
        return this.activeItem && this.activeItem.children.length > 0;
    }
    get isLoadMoreButton() {
        return this.activeItem && this.activeItem.loadMoreButton;
    }
    get focusableItem() {
        return this.activeItem || this.model.firstFocusableNode();
    }
    activate(item) {
        if (!this.navigable || !item || this.isActive(nodeIndex(item))) {
            return;
        }
        this.isFocused = true;
        this.activeItem = item || this.activeItem;
        this.notifyMove();
    }
    activateParent(index) {
        this.activate(this.model.findParent(index));
    }
    activateIndex(index) {
        if (!index) {
            return;
        }
        this.activate(this.model.findNode(index));
    }
    activateClosest(index) {
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
    checkIndex(index) {
        if (!this.isDisabled(index)) {
            this.checks.next(index);
        }
    }
    selectIndex(index) {
        if (!this.isDisabled(index)) {
            this.selects.next(index);
        }
    }
    notifyLoadMore(index) {
        if (!isPresent(index)) {
            return;
        }
        this.loadMore.next(index);
    }
    isActive(index) {
        if (!index) {
            return false;
        }
        return this.isFocused && this.activeIndex === index;
    }
    isFocusable(index) {
        return nodeIndex(this.focusableItem) === index;
    }
    isDisabled(index) {
        return this.model.findNode(index).disabled;
    }
    registerItem(id, index, disabled, loadMoreButton = false, visible = true) {
        const itemAtIndex = this.model.findNode(index);
        if (isPresent(itemAtIndex)) {
            this.model.unregisterItem(itemAtIndex.id, itemAtIndex.index);
            if (this.isActive(index)) {
                this.deactivate();
            }
        }
        this.model.registerItem(id, index, disabled, loadMoreButton, visible);
    }
    unregisterItem(id, index) {
        if (this.isActive(index)) {
            this.activateParent(index);
        }
        this.model.unregisterItem(id, index);
    }
    move(e) {
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
    expand({ expand, intercept }) {
        const index = nodeIndex(this.activeItem);
        if (!index || intercept(index)) {
            return;
        }
        this.notifyExpand(expand);
    }
    moveToParent() {
        if (this.isActiveExpanded) {
            return false;
        }
        this.activate(this.model.findParent(nodeIndex(this.activeItem)));
        return true;
    }
    moveToFirstVisibleChild() {
        if (!this.isActiveExpanded) {
            return false;
        }
        this.activate(this.model.findVisibleChild(nodeIndex(this.activeItem)));
        return true;
    }
    notifyExpand(expand) {
        this.expands.next(this.navigationState(expand));
    }
    notifyMove() {
        this.moves.next(this.navigationState());
    }
    navigationState(expand = false) {
        return ({ expand, index: this.activeIndex, isFocused: this.isFocused });
    }
    handleEnter() {
        if (!this.navigable) {
            return;
        }
        if (this.isLoadMoreButton) {
            this.notifyLoadMore(this.activeIndex);
        }
        else {
            this.selectIndex(this.activeIndex);
        }
    }
    handleSpace() {
        if (!this.navigable) {
            return;
        }
        if (this.isLoadMoreButton) {
            this.notifyLoadMore(this.activeIndex);
        }
        else {
            this.checkIndex(this.activeIndex);
        }
    }
};
NavigationService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [LocalizationService])
], NavigationService);
export { NavigationService };
