/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NavigationService } from './navigation/navigation.service';
import { SelectionService } from './selection/selection.service';
import { isSelected } from './default-callbacks';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
/**
 * @hidden
 *
 * A directive which manages the expanded state of the TreeView.
 */
let TreeViewItemContentDirective = class TreeViewItemContentDirective {
    constructor(element, navigationService, selectionService, renderer) {
        this.element = element;
        this.navigationService = navigationService;
        this.selectionService = selectionService;
        this.renderer = renderer;
        this.initialSelection = false;
        this.isSelected = isSelected;
        this.subscriptions = new Subscription();
        this.subscriptions.add(this.navigationService.moves
            .subscribe(this.updateFocusClass.bind(this)));
        this.subscriptions.add(this.navigationService.selects
            .pipe(filter((index) => index === this.index))
            .subscribe((index) => this.selectionService.select(index, this.dataItem)));
        this.subscriptions.add(this.selectionService.changes
            .subscribe(() => {
            this.updateSelectionClass(this.isSelected(this.dataItem, this.index));
        }));
    }
    ngOnChanges(changes) {
        if (changes.initialSelection) {
            this.updateSelectionClass(this.initialSelection);
        }
        if (changes.index) {
            this.updateFocusClass();
        }
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    updateFocusClass() {
        this.render(this.navigationService.isActive(this.index), 'k-state-focused');
    }
    updateSelectionClass(selected) {
        this.render(selected, 'k-state-selected');
    }
    render(addClass, className) {
        const action = addClass ? 'addClass' : 'removeClass';
        this.renderer[action](this.element.nativeElement, className);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TreeViewItemContentDirective.prototype, "dataItem", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TreeViewItemContentDirective.prototype, "index", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewItemContentDirective.prototype, "initialSelection", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], TreeViewItemContentDirective.prototype, "isSelected", void 0);
TreeViewItemContentDirective = tslib_1.__decorate([
    Directive({ selector: '[kendoTreeViewItemContent]' }),
    tslib_1.__metadata("design:paramtypes", [ElementRef,
        NavigationService,
        SelectionService,
        Renderer2])
], TreeViewItemContentDirective);
export { TreeViewItemContentDirective };
