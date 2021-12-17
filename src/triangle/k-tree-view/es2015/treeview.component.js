/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, HostBinding, Input, NgZone, Output, Renderer2, ViewChild, ViewContainerRef, isDevMode, forwardRef, ChangeDetectorRef } from '@angular/core';
import { anyChanged, hasObservers, isDocumentAvailable } from '@progress/kendo-angular-common';
import { L10N_PREFIX, LocalizationService } from '@progress/kendo-angular-l10n';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { validatePackage } from '@progress/kendo-licensing';
import { packageMetadata } from './package-metadata';
import { DataChangeNotificationService } from './data-change-notification.service';
import { hasChildren, isChecked, isDisabled, isExpanded, isSelected, isVisible, trackBy } from './default-callbacks';
import { ExpandStateService } from './expand-state.service';
import { IndexBuilderService } from './index-builder.service';
import { LoadingNotificationService } from './loading-notification.service';
import { NavigationService } from './navigation/navigation.service';
import { NodeChildrenService } from './node-children.service';
import { NodeTemplateDirective } from './node-template.directive';
import { LoadMoreButtonTemplateDirective } from './load-more/load-more-button-template.directive';
import { DataBoundComponent } from './data-bound-component';
import { ExpandableComponent } from './expandable-component';
import { SelectionService } from './selection/selection.service';
import { TreeViewLookupService } from './treeview-lookup.service';
import { closestNode, focusableNode, hasParent, isContent, isFocusable, match, nodeId, isLoadMoreButton, isPresent, nodeIndex, buildTreeItem } from './utils';
const LOAD_MORE_DOC_LINK = 'http://www.telerik.com/kendo-angular-ui/components/treeview/load-more-button/';
const providers = [
    ExpandStateService,
    IndexBuilderService,
    TreeViewLookupService,
    LoadingNotificationService,
    NodeChildrenService,
    NavigationService,
    SelectionService,
    DataChangeNotificationService,
    LocalizationService,
    {
        provide: L10N_PREFIX,
        useValue: 'kendo.treeview'
    },
    {
        provide: DataBoundComponent,
        useExisting: forwardRef(() => TreeViewComponent)
    },
    {
        provide: ExpandableComponent,
        useExisting: forwardRef(() => TreeViewComponent)
    }
];
/* tslint:disable:member-ordering */
/**
 * Represents the [Kendo UI TreeView component for Angular]({% slug overview_treeview %}).
 *
 * @example
 * {% meta height:450 %}
 * {% embed_file get-started/app.component.ts preview %}
 * {% embed_file get-started/app.module.ts %}
 * {% embed_file shared/main.ts %}
 * {% endmeta %}
 */
let TreeViewComponent = class TreeViewComponent {
    constructor(element, changeDetectorRef, expandService, navigationService, nodeChildrenService, selectionService, treeViewLookupService, ngZone, renderer, dataChangeNotification, localization) {
        this.element = element;
        this.changeDetectorRef = changeDetectorRef;
        this.expandService = expandService;
        this.navigationService = navigationService;
        this.nodeChildrenService = nodeChildrenService;
        this.selectionService = selectionService;
        this.treeViewLookupService = treeViewLookupService;
        this.ngZone = ngZone;
        this.renderer = renderer;
        this.dataChangeNotification = dataChangeNotification;
        this.localization = localization;
        this.classNames = true;
        this.role = 'tree';
        /**
         * The hint which is displayed when the component is empty.
         */
        this.filterInputPlaceholder = "";
        /** @hidden */
        this.fetchNodes = () => this.data;
        /**
         * Fires when the children of the expanded node are loaded.
         */
        this.childrenLoaded = new EventEmitter();
        /**
         * Fires when the user blurs the component.
         */
        this.onBlur = new EventEmitter();
        /**
         * Fires when the user focuses the component.
         */
        this.onFocus = new EventEmitter();
        /**
         * Fires when the user expands a TreeView node.
         */
        this.expand = new EventEmitter();
        /**
         * Fires when the user collapses a TreeView node.
         */
        this.collapse = new EventEmitter();
        /**
         * Fires just before the dragging of the node starts ([see example]({% slug draganddrop_treeview %}#toc-setup)). This event is preventable.
         * If you prevent the event default, no drag hint will be created and the subsequent drag-related events will not be fired.
         */
        this.nodeDragStart = new EventEmitter();
        /**
         * Fires when an item is being dragged ([see example]({% slug draganddrop_treeview %}#toc-setup)).
         */
        this.nodeDrag = new EventEmitter();
        /**
         * Emits when the built-in filtering mechanism in the data-binding directives updates the node's visibility.
         * Used for the built-in auto-expand functionalities of the component and available for custom implementations.
         */
        this.filterStateChange = new EventEmitter();
        /**
         * Fires on the target TreeView when a dragged item is dropped ([see example]({% slug draganddrop_treeview %}#toc-setup)).
         * This event is preventable. If you prevent the event default (`event.preventDefualt()`) or invalidate its state (`event.setValid(false)`),
         * the `addItem` and `removeItem` events will not be triggered.
         *
         * Both operations cancel the default drop operation, but the indication to the user is different. `event.setValid(false)` indicates that the operation was
         * unsuccessful by animating the drag clue to its original position. `event.preventDefault()` simply removes the clue, as if it has been dropped successfully.
         * As a general rule, use `preventDefault` to manually handle the add and remove operations, and `setValid(false)` to indicate the operation was unsuccessful.
         */
        this.nodeDrop = new EventEmitter();
        /**
         * Fires on the source TreeView after the dragged item has been dropped ([see example]({% slug draganddrop_treeview %}#toc-setup)).
         */
        this.nodeDragEnd = new EventEmitter();
        /**
         * Fires after a dragged item is dropped ([see example]({% slug draganddrop_treeview %}#toc-setup)).
         * Called on the TreeView where the item is dropped.
         */
        this.addItem = new EventEmitter();
        /**
         * Fires after a dragged item is dropped ([see example]({% slug draganddrop_treeview %}#toc-setup)).
         * Called on the TreeView from where the item is dragged.
         */
        this.removeItem = new EventEmitter();
        /**
         * Fires when the user selects a TreeView node checkbox
         * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
         */
        this.checkedChange = new EventEmitter();
        /**
         * Fires when the user selects a TreeView node
         * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
         */
        this.selectionChange = new EventEmitter();
        /**
         * Fires when the value of the built-in filter input element changes.
         */
        this.filterChange = new EventEmitter();
        /**
         * Fires when the user clicks a TreeView node.
         */
        this.nodeClick = new EventEmitter();
        /**
         * Fires when the user double clicks a TreeView node.
         */
        this.nodeDblClick = new EventEmitter();
        /**
         * A function that defines how to track node changes.
         * By default, the TreeView tracks the nodes by data item object reference.
         *
         * @example
         * ```ts
         *  @Component({
         *      selector: 'my-app',
         *      template: `
         *          <kendo-treeview
         *              [nodes]="data"
         *              textField="text"
         *              [trackBy]="trackBy"
         *          >
         *          </kendo-treeview>
         *      `
         *  })
         *  export class AppComponent {
         *      public data: any[] = [
         *          { text: "Furniture" },
         *          { text: "Decor" }
         *      ];
         *
         *      public trackBy(index: number, item: any): any {
         *          return item.text;
         *      }
         *  }
         * ```
         */
        this.trackBy = trackBy;
        /**
         * A function which determines if a specific node is disabled.
         */
        this.isDisabled = isDisabled;
        /**
         * A callback which determines whether a TreeView node should be rendered as hidden. The utility .k-display-none class is used to hide the nodes.
         * Useful for custom filtering implementations.
         */
        this.isVisible = isVisible;
        /**
         * Determines whether the TreeView keyboard navigable is enabled.
         */
        this.navigable = true;
        /**
         * A function which provides the child nodes for a given parent node
         * ([see example]({% slug databinding_treeview %})).
         */
        this.children = () => of([]);
        /**
         * Indicates whether the child nodes will be fetched on node expand or will be initially prefetched.
         * @default true
         */
        this.loadOnDemand = true;
        /**
         * Renders the built-in input element for filtering the TreeView.
         * If set to `true`, the component emits the `filterChange` event, which can be used to [filter the TreeView manually]({% slug filtering_treeview %}#toc-manual-filtering).
         * A built-in filtering implementation is available to use with the [`kendoTreeViewHierarchyBinding`]({% slug api_treeview_hierarchybindingdirective %}) and [`kendoTreeViewFlatDataBinding`]({% slug api_treeview_flatdatabindingdirective %}) directives.
         */
        this.filterable = false;
        /**
         * Sets an initial value of the built-in input element used for filtering.
         */
        this.filter = '';
        this.checkboxes = false;
        this.expandIcons = false;
        this.selectable = false;
        this.touchActions = true;
        this.isActive = false;
        this.data = new BehaviorSubject([]);
        this._animate = true;
        this.subscriptions = new Subscription();
        this.domSubscriptions = [];
        validatePackage(packageMetadata);
    }
    /** @hidden */
    get direction() {
        return this.localization.rtl ? 'rtl' : 'ltr';
    }
    /**
     * Determines whether the content animation is enabled.
     */
    set animate(value) {
        this._animate = value;
    }
    get animate() {
        return !this._animate;
    }
    /**
     * @hidden
     *
     * Defines the template for each node.
     * Takes precedence over nested templates in the TreeView tag.
     */
    set nodeTemplateRef(template) {
        this._nodeTemplateRef = template;
    }
    get nodeTemplateRef() {
        return this._nodeTemplateRef || this.nodeTemplateQuery;
    }
    /**
     * @hidden
     *
     * Defines the template for each load-more button.
     * Takes precedence over nested templates in the TreeView tag.
     */
    set loadMoreButtonTemplateRef(template) {
        this._loadMoreButtonTemplateRef = template;
    }
    get loadMoreButtonTemplateRef() {
        return this._loadMoreButtonTemplateRef || this.loadMoreButtonTemplateQuery;
    }
    /**
     * The nodes which will be displayed by the TreeView
     * ([see example]({% slug databinding_treeview %})).
     */
    set nodes(value) {
        this.data.next(value || []);
        this.dataChangeNotification.notify();
    }
    get nodes() {
        return this.data.value;
    }
    /**
     * A function which determines if a specific node has child nodes
     * ([see example]({% slug databinding_treeview %})).
     */
    get hasChildren() {
        return this._hasChildren || hasChildren;
    }
    set hasChildren(callback) {
        this._hasChildren = callback;
        this.expandIcons = Boolean(this._isExpanded && this._hasChildren);
    }
    /**
     * A function which determines if a specific node is checked
     * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
     */
    get isChecked() {
        return this._isChecked || isChecked;
    }
    set isChecked(callback) {
        this._isChecked = callback;
        this.checkboxes = Boolean(this._isChecked);
    }
    /**
     * A function which determines if a specific node is expanded.
     */
    get isExpanded() {
        return this._isExpanded || isExpanded;
    }
    set isExpanded(callback) {
        this._isExpanded = callback;
        this.expandIcons = Boolean(this._isExpanded && this._hasChildren);
    }
    /**
     * A function which determines if a specific node is selected
     * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
     */
    get isSelected() {
        return this._isSelected || isSelected;
    }
    set isSelected(callback) {
        this._isSelected = callback;
        this.selectable = Boolean(this._isSelected);
    }
    ngOnChanges(changes) {
        this.navigationService.navigable = Boolean(this.navigable);
        // TODO: should react to changes.loadOnDemand as well - should preload the data or clear the already cached items
        if (anyChanged(['nodes', 'children', 'hasChildren', 'loadOnDemand'], changes, false) && !this.loadOnDemand) {
            this.preloadChildNodes();
        }
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.domSubscriptions.forEach(subscription => subscription());
    }
    ngOnInit() {
        this.subscriptions.add(this.nodeChildrenService
            .changes
            .subscribe((x) => this.childrenLoaded.emit(x)));
        this.subscriptions.add(this.expandService.changes
            .subscribe(({ index, dataItem, expand }) => expand
            ? this.expand.emit({ index, dataItem })
            : this.collapse.emit({ index, dataItem })));
        this.subscriptions.add(this.navigationService.checks
            .subscribe((x) => this.checkedChange.emit(this.treeViewLookupService.itemLookup(x))));
        this.subscriptions.add(this.selectionService.changes
            .subscribe((x) => {
            if (hasObservers(this.selectionChange)) {
                this.ngZone.run(() => {
                    this.selectionChange.emit(x);
                });
            }
        }));
        if (this.element) {
            this.ngZone.runOutsideAngular(() => {
                this.attachDomHandlers();
            });
        }
    }
    /**
     * Blurs the focused TreeView item.
     */
    blur() {
        if (!isDocumentAvailable()) {
            return;
        }
        const target = focusableNode(this.element);
        if (document.activeElement === target) {
            target.blur();
        }
    }
    /**
     * Focuses the first focusable item in the TreeView component if no hierarchical index is provided.
     *
     * @example
     * ```ts
     * import { Component } from '@angular/core';
     *
     *  @Component({
     *      selector: 'my-app',
     *      template: `
     *      <button (click)="treeview.focus('1')">Focuses the second node</button>
     *      <kendo-treeview
     *          #treeview
     *          [nodes]="data"
     *          textField="text"
     *      >
     *      </kendo-treeview>
     *  `
     *  })
     *  export class AppComponent {
     *      public data: any[] = [
     *          { text: "Furniture" },
     *          { text: "Decor" }
     *      ];
     *  }
     * ```
     */
    focus(index) {
        const focusIndex = index || nodeIndex(this.navigationService.focusableItem);
        this.navigationService.activateIndex(focusIndex);
        const target = focusableNode(this.element);
        if (target) {
            target.focus();
        }
    }
    /**
     * Based on the specified index, returns the TreeItemLookup node.
     *
     * @param index - The index of the node.
     * @returns {TreeItemLookup} - The item that was searched (looked up).
     */
    itemLookup(index) {
        return this.treeViewLookupService.itemLookup(index);
    }
    /**
     * Triggers the [`children`]({% slug api_treeview_treeviewcomponent %}#toc-children) function for every expanded node,
     * causing all rendered child nodes to be fetched again.
     */
    rebindChildren() {
        this.dataChangeNotification.notify();
    }
    /**
     * Triggers the `expand` event for the provided node and displays it's loading indicator.
     */
    expandNode(item, index) {
        this.expandService.expand(index, item);
    }
    /**
     * Triggers the `collapse` event for the provided node.
     */
    collapseNode(item, index) {
        this.expandService.collapse(index, item);
    }
    /**
     * Gets the current page size of the checked data item children collection
     * ([see example]({% slug loadmorebutton_treeview %}#toc-managing-page-sizes)).
     *
     * > Since the root nodes collection is not associated with any parent data item, pass `null` as `dataItem` param to get its page size.
     *
     * @param dataItem {any} - The parent data item of the targeted collection.
     * @returns {number} - The page size of the checked data item children collection.
     */
    getNodePageSize(dataItem) {
        this.verifyLoadMoreService();
        return this.loadMoreService.getGroupSize(dataItem);
    }
    /**
     * Sets the page size of the targeted data item children collection
     * ([see example]({% slug loadmorebutton_treeview %}#toc-managing-page-sizes)).
     *
     * > Since the root nodes collection is not associated with any parent data item, pass `null` as `dataItem` param to target its page size.
     *
     * @param dataItem {any} - The parent data item of the targeted collection.
     * @param pageSize {number} - The new page size.
     */
    setNodePageSize(dataItem, pageSize) {
        this.verifyLoadMoreService();
        this.loadMoreService.setGroupSize(dataItem, pageSize);
    }
    /**
     * @hidden
     *
     * Clears the current TreeViewLookupService node map and re-registers all nodes anew.
     * Child nodes are acquired through the provided `children` callback.
     */
    preloadChildNodes() {
        this.treeViewLookupService.reset();
        this.registerLookupItems(this.nodes);
    }
    attachDomHandlers() {
        const element = this.element.nativeElement;
        this.clickHandler = this.clickHandler.bind(this);
        this.domSubscriptions.push(this.renderer.listen(element, 'contextmenu', this.clickHandler), this.renderer.listen(element, 'click', this.clickHandler), this.renderer.listen(element, 'dblclick', this.clickHandler), this.renderer.listen(element, 'focusin', this.focusHandler.bind(this)), this.renderer.listen(element, 'focusout', this.blurHandler.bind(this)), this.renderer.listen(element, 'keydown', this.keydownHandler.bind(this)));
    }
    focusHandler(e) {
        let focusItem;
        if (match(e.target, '.k-treeview-item')) {
            focusItem = e.target;
        }
        else if (!isFocusable(e.target)) { // with compliments to IE
            focusItem = closestNode(e.target);
        }
        if (focusItem) {
            this.navigationService.activateIndex(nodeId(e.target));
            if (!this.isActive && hasObservers(this.onFocus)) {
                this.ngZone.run(() => {
                    this.onFocus.emit();
                });
            }
            this.isActive = true;
        }
    }
    blurHandler(e) {
        if (this.isActive && match(e.target, '.k-treeview-item') &&
            (!e.relatedTarget || !match(e.relatedTarget, '.k-treeview-item') || !hasParent(e.relatedTarget, this.element.nativeElement))) {
            this.navigationService.deactivate();
            this.isActive = false;
            if (hasObservers(this.onBlur)) {
                this.ngZone.run(() => {
                    this.onBlur.emit();
                });
            }
        }
    }
    clickHandler(e) {
        const target = e.target;
        if ((e.type === 'contextmenu' && !hasObservers(this.nodeClick)) ||
            (e.type === 'click' && !hasObservers(this.nodeClick) && !hasObservers(this.selectionChange) && !isLoadMoreButton(target)) ||
            (e.type === 'dblclick' && !hasObservers(this.nodeDblClick)) || isFocusable(target) ||
            (!isContent(target) && !isLoadMoreButton(target)) || !hasParent(target, this.element.nativeElement)) {
            return;
        }
        const index = nodeId(closestNode(target));
        // the disabled check is probably not needed due to the k-state-disabled styles
        if (!index || this.navigationService.isDisabled(index)) {
            return;
        }
        this.ngZone.run(() => {
            // record this value before emitting selectionChange (`this.navigationService.selectIndex`), as the treeview state may be changed on its emission
            const lookup = this.treeViewLookupService.itemLookup(index);
            if (e.type === 'click') {
                const loadMoreButton = this.navigationService.model.findNode(index).loadMoreButton;
                if (loadMoreButton) {
                    this.navigationService.notifyLoadMore(index);
                    return;
                }
                else {
                    this.navigationService.selectIndex(index);
                }
            }
            const emitter = e.type === 'dblclick' ? this.nodeDblClick : this.nodeClick;
            emitter.emit({
                item: lookup.item,
                originalEvent: e,
                type: e.type
            });
        });
    }
    keydownHandler(e) {
        if (this.isActive && this.navigable) {
            this.ngZone.run(() => {
                this.navigationService.move(e);
            });
        }
    }
    verifyLoadMoreService() {
        if (isDevMode() && !isPresent(this.loadMoreService)) {
            throw new Error(`To use the TreeView paging functionality, you need to assign the \`kendoTreeViewLoadMore\` directive. See ${LOAD_MORE_DOC_LINK}.`);
        }
    }
    registerLookupItems(data, parentItem = null) {
        if (!isPresent(data) || data.length === 0) {
            return;
        }
        const parentIndex = nodeIndex(parentItem);
        const treeItems = data.map((node, index) => buildTreeItem(node, index, parentIndex));
        if (isPresent(parentItem)) {
            this.treeViewLookupService.registerChildren(parentIndex, treeItems);
        }
        treeItems.forEach(item => {
            this.treeViewLookupService.registerItem(item, parentItem);
            if (this.hasChildren(item.dataItem)) {
                this.children(item.dataItem)
                    .subscribe(children => this.registerLookupItems(children, item));
            }
        });
    }
};
tslib_1.__decorate([
    HostBinding("class.k-widget"),
    HostBinding("class.k-treeview"),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewComponent.prototype, "classNames", void 0);
tslib_1.__decorate([
    HostBinding("attr.role"),
    tslib_1.__metadata("design:type", String)
], TreeViewComponent.prototype, "role", void 0);
tslib_1.__decorate([
    HostBinding("attr.dir"),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [])
], TreeViewComponent.prototype, "direction", null);
tslib_1.__decorate([
    ViewChild('assetsContainer', { read: ViewContainerRef, static: true }),
    tslib_1.__metadata("design:type", ViewContainerRef)
], TreeViewComponent.prototype, "assetsContainer", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TreeViewComponent.prototype, "filterInputPlaceholder", void 0);
tslib_1.__decorate([
    Input(),
    HostBinding('@.disabled'),
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [Boolean])
], TreeViewComponent.prototype, "animate", null);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "childrenLoaded", void 0);
tslib_1.__decorate([
    Output('blur'),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "onBlur", void 0);
tslib_1.__decorate([
    Output('focus'),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "onFocus", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "expand", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "collapse", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "nodeDragStart", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "nodeDrag", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "filterStateChange", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "nodeDrop", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "nodeDragEnd", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "addItem", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "removeItem", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "checkedChange", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "selectionChange", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "filterChange", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "nodeClick", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TreeViewComponent.prototype, "nodeDblClick", void 0);
tslib_1.__decorate([
    ContentChild(NodeTemplateDirective, { static: false }),
    tslib_1.__metadata("design:type", NodeTemplateDirective)
], TreeViewComponent.prototype, "nodeTemplateQuery", void 0);
tslib_1.__decorate([
    Input('nodeTemplate'),
    tslib_1.__metadata("design:type", NodeTemplateDirective),
    tslib_1.__metadata("design:paramtypes", [NodeTemplateDirective])
], TreeViewComponent.prototype, "nodeTemplateRef", null);
tslib_1.__decorate([
    ContentChild(LoadMoreButtonTemplateDirective, { static: false }),
    tslib_1.__metadata("design:type", LoadMoreButtonTemplateDirective)
], TreeViewComponent.prototype, "loadMoreButtonTemplateQuery", void 0);
tslib_1.__decorate([
    Input('loadMoreButtonTemplate'),
    tslib_1.__metadata("design:type", LoadMoreButtonTemplateDirective),
    tslib_1.__metadata("design:paramtypes", [LoadMoreButtonTemplateDirective])
], TreeViewComponent.prototype, "loadMoreButtonTemplateRef", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], TreeViewComponent.prototype, "trackBy", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array),
    tslib_1.__metadata("design:paramtypes", [Array])
], TreeViewComponent.prototype, "nodes", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TreeViewComponent.prototype, "textField", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], TreeViewComponent.prototype, "hasChildren", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], TreeViewComponent.prototype, "isChecked", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], TreeViewComponent.prototype, "isDisabled", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], TreeViewComponent.prototype, "isExpanded", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], TreeViewComponent.prototype, "isSelected", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], TreeViewComponent.prototype, "isVisible", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewComponent.prototype, "navigable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], TreeViewComponent.prototype, "children", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewComponent.prototype, "loadOnDemand", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TreeViewComponent.prototype, "filterable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TreeViewComponent.prototype, "filter", void 0);
TreeViewComponent = tslib_1.__decorate([
    Component({
        changeDetection: ChangeDetectionStrategy.Default,
        exportAs: 'kendoTreeView',
        providers: providers,
        selector: 'kendo-treeview',
        template: `
        <kendo-textbox
            #filterInput
            *ngIf="filterable"
            [value]="filter"
            [clearButton]="true"
            (valueChange)="filterChange.emit($event)"
            [placeholder]="filterInputPlaceholder"
        >
            <ng-template kendoTextBoxPrefixTemplate>
                <span class="k-icon k-i-search"></span>
            </ng-template>
        </kendo-textbox>
        <ul class="k-treeview-lines"
            kendoTreeViewGroup
            role="group"
            [loadOnDemand]="loadOnDemand"
            [checkboxes]="checkboxes"
            [expandIcons]="expandIcons"
            [selectable]="selectable"
            [touchActions]="touchActions"
            [children]="children"
            [hasChildren]="hasChildren"
            [isChecked]="isChecked"
            [isDisabled]="isDisabled"
            [isExpanded]="isExpanded"
            [isSelected]="isSelected"
            [isVisible]="isVisible"
            [nodeTemplateRef]="nodeTemplateRef?.templateRef"
            [loadMoreButtonTemplateRef]="loadMoreButtonTemplateRef?.templateRef"
            [textField]="textField"
            [nodes]="fetchNodes"
            [loadMoreService]="loadMoreService"
            [trackBy]="trackBy"
        >
        </ul>
        <ng-container #assetsContainer></ng-container>
    `
    }),
    tslib_1.__metadata("design:paramtypes", [ElementRef,
        ChangeDetectorRef,
        ExpandStateService,
        NavigationService,
        NodeChildrenService,
        SelectionService,
        TreeViewLookupService,
        NgZone,
        Renderer2,
        DataChangeNotificationService,
        LocalizationService])
], TreeViewComponent);
export { TreeViewComponent };
