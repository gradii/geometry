/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, ElementRef, NgZone, ContentChild, Input, HostBinding } from '@angular/core';
import { hasObservers } from '@progress/kendo-angular-common';
import Draggable from '@telerik/kendo-draggable';
import { DragClueService } from './drag-clue/drag-clue.service';
import { DropHintService } from './drop-hint/drop-hint.service';
import { DragClueTemplateDirective } from './drag-clue/drag-clue-template.directive';
import { DropHintTemplateDirective } from './drop-hint/drop-hint-template.directive';
import { getDropAction, getDropPosition, treeItemFromEventTarget, getContainerOffset, getDropTarget } from './drag-and-drop-utils';
import { closestWithMatch, isPresent, isContent } from '../utils';
import { TreeViewComponent } from '../treeview.component';
import { TreeItemDropEvent, DropPosition, TreeItemDragStartEvent } from './models';
const DEFAULT_SCROLL_SETTINGS = {
    enabled: true,
    step: 1,
    interval: 1
};
/**
 * A directive which enables the dragging and dropping items inside the current TreeView or between multiple linked TreeView component instances
 * ([see example]({% slug draganddrop_treeview %})).
 *
 * Triggers the [`nodeDragStart`]({% slug api_treeview_treeviewcomponent %}#toc-nodedragstart),
 * [`nodeDrag`]({% slug api_treeview_treeviewcomponent %}#toc-nodedrag),
 * [`nodeDrop`]({% slug api_treeview_treeviewcomponent %}#toc-nodedrop),
 * [`nodeDragEnd`]({% slug api_treeview_treeviewcomponent %}#toc-nodedragend),
 * [`addItem`]({% slug api_treeview_treeviewcomponent %}#toc-additem) and
 * [`removeItem`]({% slug api_treeview_treeviewcomponent %}#toc-removeitem)
 * events when the corresponding actions occur on the respective TreeView instance.
 */
let DragAndDropDirective = class DragAndDropDirective {
    constructor(element, zone, treeview, dragClueService, dropHintService) {
        this.element = element;
        this.zone = zone;
        this.treeview = treeview;
        this.dragClueService = dragClueService;
        this.dropHintService = dropHintService;
        /**
         * Specifies whether the `removeItem` event will be fired after an item is dropped when the `ctrl` key is pressed.
         * If enabled, the `removeItem` event will not be fired on the source TreeView
         * ([see example]({% slug draganddrop_treeview %}#toc-multiple-treeviews)).
         *
         * @default false
         */
        this.allowCopy = false;
        /**
         * Specifes the TreeViewComponent instances into which dragged items from the current TreeViewComponent can be dropped
         * ([see example]({% slug draganddrop_treeview %}#toc-multiple-treeviews)).
         */
        this.dropZoneTreeViews = [];
        /**
         * Specifies the distance in pixels from the initial item pointerdown event, before the dragging is initiated.
         * The `nodeDragStart` and all consequent TreeView drag events will not be fired until the actual dragging begins.
         *
         * @default 5
         */
        this.startDragAfter = 5;
        /**
         * Controlls the auto-scrolling behavior during drag-and-drop ([see example]({% slug draganddrop_treeview %}#toc-auto-scrolling)).
         * Enbaled by default. To turn the auto-scrolling off, set this prop to `false`.
         *
         * By default, the scrolling will be performed by 1 pixel at every 1 millisecond, when the dragged item reaches the top or the bottom of the scrollable container.
         * The `step` and `interval` can be overridden by providing a `DragAndDropScrollSettings` object to this prop.
         *
         * @default true
         */
        this.autoScroll = true;
        /**
         * @hidden
         */
        this.userSelectStyle = 'none';
        /**
         * Describes the offset of the parent element if the latter has the `transform` CSS prop applied.
         * Transformed parents create new stacking context and the fixed children must be position based on the transformed parent.
         * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
         */
        this.containerOffset = { top: 0, left: 0 };
        this.treeview.touchActions = false;
    }
    get scrollSettings() {
        const userProvidedSettings = typeof this.autoScroll === 'boolean' ?
            { enabled: this.autoScroll } :
            this.autoScroll;
        return Object.assign({}, DEFAULT_SCROLL_SETTINGS, userProvidedSettings);
    }
    ngAfterContentInit() {
        this.initalizeDraggable();
        this.dragClueService.initialize(this.treeview.assetsContainer, this.dragClueTemplate && this.dragClueTemplate.templateRef);
        this.dropHintService.initialize(this.treeview.assetsContainer, this.dropHintTemplate && this.dropHintTemplate.templateRef);
    }
    ngOnDestroy() {
        this.draggable.destroy();
    }
    /**
     * @hidden
     */
    handlePress({ originalEvent }) {
        if (!isContent(originalEvent.target)) {
            return;
        }
        // store the drag target on press, show it only when it's actually dragged
        this.draggedItem = closestWithMatch(originalEvent.target, '.k-in');
        // record the current pointer down coords - copared to the `startDragAfter` value to calculate whether to initiate dragging
        this.pendingDragStartEvent = originalEvent;
    }
    /**
     * @hidden
     */
    handleDrag({ originalEvent, clientX, clientY }) {
        if (this.shouldInitiateDragStart({ clientX, clientY })) {
            this.initiateDragStart();
        }
        if (!isPresent(this.draggedItem) || isPresent(this.pendingDragStartEvent)) {
            return;
        }
        const dropTarget = getDropTarget(originalEvent);
        if (hasObservers(this.treeview.nodeDrag)) {
            this.zone.run(() => this.notifyDrag(originalEvent, dropTarget));
        }
        const targetTreeView = this.getTargetTreeView(dropTarget);
        const dropPosition = getDropPosition(this.draggedItem, dropTarget, clientY, targetTreeView, this.containerOffset);
        const dropHintAnchor = closestWithMatch(dropTarget, '.k-mid');
        const dropAction = getDropAction(dropPosition, dropTarget);
        const sourceItem = treeItemFromEventTarget(this.treeview, this.draggedItem);
        const destinationItem = treeItemFromEventTarget(targetTreeView, dropTarget);
        this.updateDropHintState(dropPosition, dropHintAnchor, dropAction, sourceItem, destinationItem);
        this.updateDragClueState(dropAction, clientX, clientY, sourceItem, destinationItem);
        if (this.scrollSettings.enabled) {
            this.dragClueService.scrollIntoView(this.scrollSettings);
        }
    }
    /**
     * @hidden
     */
    handleRelease({ originalEvent, clientY }) {
        if (this.scrollSettings.enabled) {
            this.dragClueService.cancelScroll();
        }
        if (!isPresent(this.draggedItem) || isPresent(this.pendingDragStartEvent)) {
            this.pendingDragStartEvent = null;
            this.draggedItem = null;
            return;
        }
        const dropTarget = getDropTarget(originalEvent);
        const sourceTree = this.treeview;
        const destinationTree = this.getTargetTreeView(dropTarget);
        const dropPosition = getDropPosition(this.draggedItem, dropTarget, clientY, this.getTargetTreeView(dropTarget), this.containerOffset);
        const sourceItem = treeItemFromEventTarget(sourceTree, this.draggedItem);
        const destinationItem = treeItemFromEventTarget(destinationTree, dropTarget);
        if (isPresent(destinationItem) && isPresent(dropPosition)) {
            this.zone.run(() => this.notifyDrop({ sourceItem, destinationItem, dropPosition, sourceTree, destinationTree }, originalEvent));
        }
        else {
            this.dragClueService.animateDragClueToElementPosition(this.draggedItem);
        }
        if (hasObservers(this.treeview.nodeDragEnd)) {
            this.zone.run(() => this.notifyDragEnd({ sourceItem, destinationItem, originalEvent }));
        }
        this.dropHintService.hide();
        this.draggedItem = null;
    }
    updateDropHintState(dropPosition, dropHintAnchor, dropAction, sourceItem, destinationItem) {
        if (!isPresent(dropHintAnchor) || dropPosition === DropPosition.Over || !isPresent(dropPosition)) {
            this.dropHintService.hide();
            return;
        }
        const anchorViewPortCoords = dropHintAnchor.getBoundingClientRect();
        const insertBefore = dropPosition === DropPosition.Before;
        const top = insertBefore ? anchorViewPortCoords.top : (anchorViewPortCoords.top + anchorViewPortCoords.height);
        this.dropHintService.updateDropHintData(dropAction, sourceItem, destinationItem);
        // clear any possible container offset created by parent elements with `transform` css property set
        this.dropHintService.move(anchorViewPortCoords.left - this.containerOffset.left, top - this.containerOffset.top);
        this.dropHintService.show();
    }
    updateDragClueState(dropAction, clientX, clientY, sourceItem, destinationItem) {
        // clear any possible container offset created by parent elements with `transform` css property set
        this.dragClueService.move(clientX - this.containerOffset.left, clientY - this.containerOffset.top);
        this.dragClueService.updateDragClueData(dropAction, sourceItem, destinationItem);
        this.dragClueService.show();
    }
    initalizeDraggable() {
        this.draggable = new Draggable({
            press: this.handlePress.bind(this),
            drag: this.handleDrag.bind(this),
            release: this.handleRelease.bind(this)
        });
        this.zone.runOutsideAngular(() => this.draggable.bindTo(this.element.nativeElement));
    }
    notifyDragStart(originalEvent, dropTarget) {
        const sourceItem = treeItemFromEventTarget(this.treeview, dropTarget);
        const event = new TreeItemDragStartEvent({ sourceItem, originalEvent });
        this.treeview.nodeDragStart.emit(event);
        return event;
    }
    notifyDrag(originalEvent, dropTarget) {
        const dragEvent = {
            sourceItem: treeItemFromEventTarget(this.treeview, this.draggedItem),
            destinationItem: treeItemFromEventTarget(this.getTargetTreeView(dropTarget), dropTarget),
            originalEvent
        };
        this.treeview.nodeDrag.emit(dragEvent);
    }
    notifyDrop(args, originalEvent) {
        const event = new TreeItemDropEvent(args, originalEvent);
        args.destinationTree.nodeDrop.emit(event);
        // disable the animations on drop and restore them afterwards (if they were initially turned on)
        this.disableAnimationsForNextTick(args.destinationTree);
        if (args.sourceTree !== args.destinationTree) {
            this.disableAnimationsForNextTick(args.sourceTree);
        }
        if (!event.isDefaultPrevented() && event.isValid) {
            this.dragClueService.hide();
            // order matters in a flat data binding scenario (first add, then remove)
            args.destinationTree.addItem.emit(args);
            if (!(originalEvent.ctrlKey && this.allowCopy)) {
                args.sourceTree.removeItem.emit(args);
            }
        }
        else if (event.isDefaultPrevented()) {
            // directly hide the clue if the default is prevented
            this.dragClueService.hide();
        }
        else if (!event.isValid) {
            // animate the clue back to the source item position if marked as invalid
            this.dragClueService.animateDragClueToElementPosition(this.draggedItem);
        }
    }
    notifyDragEnd(dragEndEvent) {
        this.treeview.nodeDragEnd.emit(dragEndEvent);
    }
    getTargetTreeView(dropTarget) {
        const treeViewTagName = this.treeview.element.nativeElement.tagName;
        const targetTreeView = closestWithMatch(dropTarget, treeViewTagName);
        return [this.treeview, ...this.dropZoneTreeViews].find(treeView => isPresent(treeView) && treeView.element.nativeElement === targetTreeView);
    }
    disableAnimationsForNextTick(treeView) {
        // the treeView.animate getter returns `true` when the animations are turned off
        // confusing, but seems on purpose (the `animate` prop sets the value of the @.disabled host-bound attribute)
        if (treeView.animate) {
            return;
        }
        treeView.animate = false;
        this.zone.runOutsideAngular(() => setTimeout(() => treeView.animate = true));
    }
    shouldInitiateDragStart(currentPointerCoords) {
        if (!isPresent(this.pendingDragStartEvent)) {
            return false;
        }
        const distanceFromPointerDown = Math.sqrt(Math.pow((this.pendingDragStartEvent.clientX - currentPointerCoords.clientX), 2) +
            Math.pow((this.pendingDragStartEvent.clientY - currentPointerCoords.clientY), 2));
        return distanceFromPointerDown >= this.startDragAfter;
    }
    initiateDragStart() {
        if (hasObservers(this.treeview.nodeDragStart)) {
            const dragStartEvent = this.zone.run(() => this.notifyDragStart(this.pendingDragStartEvent, getDropTarget(this.pendingDragStartEvent)));
            if (dragStartEvent.isDefaultPrevented()) {
                this.pendingDragStartEvent = null;
                this.draggedItem = null;
                return;
            }
        }
        this.dragClueService.cancelReturnAnimation();
        this.dragClueService.updateText(this.draggedItem.innerText);
        this.containerOffset = getContainerOffset(this.draggedItem);
        this.pendingDragStartEvent = null;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DragAndDropDirective.prototype, "allowCopy", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], DragAndDropDirective.prototype, "dropZoneTreeViews", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], DragAndDropDirective.prototype, "startDragAfter", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DragAndDropDirective.prototype, "autoScroll", void 0);
tslib_1.__decorate([
    ContentChild(DragClueTemplateDirective, { static: false }),
    tslib_1.__metadata("design:type", DragClueTemplateDirective)
], DragAndDropDirective.prototype, "dragClueTemplate", void 0);
tslib_1.__decorate([
    ContentChild(DropHintTemplateDirective, { static: false }),
    tslib_1.__metadata("design:type", DropHintTemplateDirective)
], DragAndDropDirective.prototype, "dropHintTemplate", void 0);
tslib_1.__decorate([
    HostBinding('style.user-select'),
    HostBinding('style.-ms-user-select'),
    HostBinding('style.-moz-user-select'),
    HostBinding('style.-webkit-user-select'),
    tslib_1.__metadata("design:type", String)
], DragAndDropDirective.prototype, "userSelectStyle", void 0);
DragAndDropDirective = tslib_1.__decorate([
    Directive({
        selector: '[kendoTreeViewDragAndDrop]',
        providers: [
            DragClueService,
            DropHintService
        ]
    }),
    tslib_1.__metadata("design:paramtypes", [ElementRef,
        NgZone,
        TreeViewComponent,
        DragClueService,
        DropHintService])
], DragAndDropDirective);
export { DragAndDropDirective };
