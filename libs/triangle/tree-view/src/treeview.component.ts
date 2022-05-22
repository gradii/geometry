/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  isDevMode,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TrackByFunction,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CheckedState } from './checkbox/checked-state';
import { DataChangeNotificationService } from './data-change-notification.service';
import { ExpandStateService } from './expand-state.service';
import { NavigationService } from './navigation/navigation.service';
import { NodeChildrenService } from './node-children.service';
import { NodeClickEvent } from './node-click-event.interface';
import { NodeTemplateDirective } from './node-template.directive';
import { LoadMoreButtonTemplateDirective } from './load-more/load-more-button-template.directive';
import { DataBoundComponent } from './data-bound-component';
import { SelectionService } from './selection/selection.service';
import { TreeItemLookup } from './treeitem-lookup.interface';
import { TreeItem } from './treeitem.interface';
import { TreeViewLookupService } from './treeview-lookup.service';
import { LoadMoreService } from './load-more/load-more.service';
import {
  EditService,
  TreeItemAddRemoveArgs,
  TreeItemDragEvent,
  TreeItemDragStartEvent,
  TreeItemDropEvent
} from './drag-and-drop/models';
import { FilterState } from './filter-state.interface';
import { TreeViewSize } from './size';
import {
  hasChildren, isChecked, isDisabled, isExpanded, isSelected, isVisible, trackBy
} from './default-callbacks';
import { IndexBuilderService } from './index-builder.service';
import { LoadingNotificationService } from './loading-notification.service';
import { ExpandableComponent } from './expandable-component';
import {
  buildTreeItem,
  closestNode,
  focusableNode,
  getSizeClass,
  hasParent,
  isContent,
  isFocusable,
  isLoadMoreButton,
  match,
  nodeId,
  nodeIndex
} from './utils';
import { anyChanged } from './helper/changes';
import { hasObservers } from './helper/has-observers';
import { Directionality } from '@angular/cdk/bidi';
import { isPresent } from '@gradii/check-type';

const providers = [
  ExpandStateService,
  IndexBuilderService,
  TreeViewLookupService,
  LoadingNotificationService,
  NodeChildrenService,
  NavigationService,
  SelectionService,
  DataChangeNotificationService,
  // LocalizationService,
  // {
  //   provide : L10N_PREFIX,
  //   useValue: 'kendo.treeview'
  // },
  {
    provide    : DataBoundComponent,
    useExisting: forwardRef(() => TreeViewComponent)
  },
  {
    provide    : ExpandableComponent,
    useExisting: forwardRef(() => TreeViewComponent)
  }
];

/* tslint:disable:member-ordering */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  exportAs       : 'triTreeView',
  providers      : providers,
  selector       : 'tri-tree-view',
  template       : `
    <span
      class="k-treeview-filter"
      *ngIf="filterable"
    >
      <tri-input-group>
        <input triInput
               [size]="size"
               [value]="filter"
               ngModel
               (ngModelChange)="filterChange.emit($event)"
               [placeholder]="filterInputPlaceholder"/>
        <ng-template #prefix>
          <tri-icon svgIcon="outline:search"></tri-icon>
        </ng-template>
      </tri-input-group>
    </span>
    <ul class="k-treeview-lines"
        triTreeViewGroup
        role="group"
        [size]="size"
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
  `,
  styleUrls: ['../style/treeview.scss']
})
export class TreeViewComponent implements OnChanges, OnInit, OnDestroy, DataBoundComponent {
  element: ElementRef<HTMLElement>;
  changeDetectorRef: ChangeDetectorRef;
  expandService: ExpandStateService;
  navigationService: NavigationService;
  nodeChildrenService: NodeChildrenService;
  selectionService: SelectionService;
  treeViewLookupService: TreeViewLookupService;
  ngZone: any;
  renderer: any;
  dataChangeNotification: any;
  localization: any;

  @HostBinding('class.k-treeview')
  classNames: boolean;

  @HostBinding('attr.role')
  role: string;

  @ViewChild('assetsContainer', {read: ViewContainerRef, static: true})
  assetsContainer: ViewContainerRef;

  @Input()
  filterInputPlaceholder: string;
  fetchNodes: () => BehaviorSubject<any[]>;

  @Output()
  childrenLoaded: EventEmitter<{ children: TreeItem[]; item: TreeItem; }>;

  @Output('blur')
  onBlur: EventEmitter<any>;

  @Output('focus')
  onFocus: EventEmitter<any>;

  @Output()
  expand: EventEmitter<TreeItem>;

  @Output()
  collapse: EventEmitter<TreeItem>;

  @Output()
  nodeDragStart: EventEmitter<TreeItemDragStartEvent>;

  @Output()
  nodeDrag: EventEmitter<TreeItemDragEvent>;

  @Output()
  filterStateChange: EventEmitter<FilterState>;

  @Output()
  nodeDrop: EventEmitter<TreeItemDropEvent>;

  @Output()
  nodeDragEnd: EventEmitter<TreeItemDragEvent>;

  @Output()
  addItem: EventEmitter<TreeItemAddRemoveArgs>;

  @Output()
  removeItem: EventEmitter<TreeItemAddRemoveArgs>;

  @Output()
  checkedChange: EventEmitter<TreeItemLookup>;

  @Output()
  selectionChange: EventEmitter<TreeItem>;

  @Output()
  filterChange: EventEmitter<string>;

  @Output()
  nodeClick: EventEmitter<NodeClickEvent>;

  @Output()
  nodeDblClick: EventEmitter<NodeClickEvent>;

  @ContentChild(NodeTemplateDirective, {static: false})
  nodeTemplateQuery: NodeTemplateDirective;

  @ContentChild(LoadMoreButtonTemplateDirective, {static: false})
  loadMoreButtonTemplateQuery: LoadMoreButtonTemplateDirective;

  @Input()
  trackBy: TrackByFunction<object>;

  @Input()
  textField: string | string[];

  @Input()
  isDisabled: (item: object, index: string) => boolean;

  @Input()
  isVisible: (item: object, index: string) => boolean;

  @Input()
  navigable: boolean;

  @Input()
  children: (item: object) => Observable<object[]>;

  @Input()
  loadOnDemand: boolean;

  @Input()
  filterable: boolean;

  @Input()
  filter: string;

  loadMoreService: LoadMoreService;
  editService: EditService;
  checkboxes: boolean;
  expandIcons: boolean;
  selectable: boolean;
  touchActions: boolean;
  isActive: boolean;
  data: BehaviorSubject<any[]>;
  _animate: any;
  _isChecked: any;
  _isExpanded: any;
  _isSelected: any;
  _hasChildren: any;
  _nodeTemplateRef: any;
  _loadMoreButtonTemplateRef: any;
  _size: any;
  subscriptions: any;
  domSubscriptions: any;

  constructor(element: ElementRef<HTMLElement>, changeDetectorRef: ChangeDetectorRef,
              expandService: ExpandStateService, navigationService: NavigationService,
              nodeChildrenService: NodeChildrenService, selectionService: SelectionService,
              treeViewLookupService: TreeViewLookupService, ngZone: NgZone, renderer: Renderer2,
              dataChangeNotification: DataChangeNotificationService,
              protected directionality: Directionality
              /*localization: LocalizationService*/) {
    this.element                = element;
    this.changeDetectorRef      = changeDetectorRef;
    this.expandService          = expandService;
    this.navigationService      = navigationService;
    this.nodeChildrenService    = nodeChildrenService;
    this.selectionService       = selectionService;
    this.treeViewLookupService  = treeViewLookupService;
    this.ngZone                 = ngZone;
    this.renderer               = renderer;
    this.dataChangeNotification = dataChangeNotification;
    // this.localization           = localization;
    this.classNames             = true;
    this.role                   = 'tree';
    /**
     * The hint which is displayed when the component is empty.
     */
    this.filterInputPlaceholder = '';
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
     *          <tri-treeview
     *              [nodes]="data"
     *              textField="text"
     *              [trackBy]="trackBy"
     *          >
     *          </tri-treeview>
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
    this.checkboxes       = false;
    this.expandIcons      = false;
    this.selectable       = false;
    this.touchActions     = true;
    this.isActive         = false;
    this.data             = new BehaviorSubject([]);
    this._animate         = true;
    this._size            = 'medium';
    this.subscriptions    = new Subscription();
    this.domSubscriptions = [];
  }

  /** @hidden */
  @HostBinding('attr.dir')
  get direction(): string {
    return this.directionality.value;
  }

  /**
   * Determines whether the content animation is enabled.
   */
  @Input()
  @HostBinding('@.disabled')
  get animate(): boolean {
    return !this._animate;
  }

  set animate(value: boolean) {
    this._animate = value;
  }

  /**
   * @hidden
   *
   * Defines the template for each node.
   * Takes precedence over nested templates in the TreeView tag.
   */
  set nodeTemplateRef(template: NodeTemplateDirective) {
    this._nodeTemplateRef = template;
  }

  @Input('nodeTemplate')
  get nodeTemplateRef(): NodeTemplateDirective {
    return this._nodeTemplateRef || this.nodeTemplateQuery;
  }

  /**
   * @hidden
   *
   * Defines the template for each load-more button.
   * Takes precedence over nested templates in the TreeView tag.
   */
  @Input('loadMoreButtonTemplate')
  get loadMoreButtonTemplateRef(): LoadMoreButtonTemplateDirective {
    return this._loadMoreButtonTemplateRef || this.loadMoreButtonTemplateQuery;
  }

  set loadMoreButtonTemplateRef(template: LoadMoreButtonTemplateDirective) {
    this._loadMoreButtonTemplateRef = template;
  }

  /**
   * The nodes which will be displayed by the TreeView
   * ([see example]({% slug databinding_treeview %})).
   */

  @Input()
  get nodes(): any[] {
    return this.data.value;
  }

  set nodes(value: any[]) {
    this.data.next(value || []);
    this.dataChangeNotification.notify();
  }

  /**
   * A function which determines if a specific node has child nodes
   * ([see example]({% slug databinding_treeview %})).
   */
  @Input()
  get hasChildren(): (item: object) => boolean {
    return this._hasChildren || hasChildren;
  }

  set hasChildren(callback: (item: object) => boolean) {
    this._hasChildren = callback;
    this.expandIcons  = Boolean(this._isExpanded && this._hasChildren);
  }

  /**
   * A function which determines if a specific node is checked
   * ([see example]({% slug checkboxes_treeview %}#toc-modifying-the-checked-state)).
   */
  @Input()
  get isChecked(): (item: object, index: string) => CheckedState {
    return this._isChecked || isChecked;
  }

  set isChecked(callback: (item: object, index: string) => CheckedState) {
    this._isChecked = callback;
    this.checkboxes = Boolean(this._isChecked);
  }

  /**
   * A function which determines if a specific node is expanded.
   */
  @Input()
  get isExpanded(): (item: object, index: string) => boolean {
    return this._isExpanded || isExpanded;
  }

  set isExpanded(callback: (item: object, index: string) => boolean) {
    this._isExpanded = callback;
    this.expandIcons = Boolean(this._isExpanded && this._hasChildren);
  }

  /**
   * A function which determines if a specific node is selected
   * ([see example]({% slug selection_treeview %}#toc-modifying-the-selection)).
   */
  @Input()
  get isSelected(): (item: object, index: string) => boolean {
    return this._isSelected || isSelected;
  }

  set isSelected(callback: (item: object, index: string) => boolean) {
    this._isSelected = callback;
    this.selectable  = Boolean(this._isSelected);
  }

  /**
   * Sets the size of the component.
   *
   * The possible values are:
   * * `'small'`
   * * `'medium'` (default)
   * * `'large'`
   * * `null`
   *
   */
  set size(size: TreeViewSize) {
    this.renderer.removeClass(this.element.nativeElement, getSizeClass('treeview', this.size));
    if (size) {
      this.renderer.addClass(this.element.nativeElement, getSizeClass('treeview', size));
    }
    this._size = size;
  }

  @Input()
  get size(): TreeViewSize {
    return this._size;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.navigationService.navigable = Boolean(this.navigable);
    // TODO: should react to changes.loadOnDemand as well - should preload the data or clear the already cached items
    if (anyChanged(['nodes', 'children', 'hasChildren', 'loadOnDemand'], changes,
      false) && !this.loadOnDemand) {
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
      .subscribe(({index, dataItem, expand}) => expand
        ? this.expand.emit({index, dataItem})
        : this.collapse.emit({index, dataItem})));
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
    if (this.size) {
      this.renderer.addClass(this.element.nativeElement, getSizeClass('treeview', this.size));
    }
  }

  /**
   * Blurs the focused TreeView item.
   */
  blur() {
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
   *      <tri-treeview
   *          #treeview
   *          [nodes]="data"
   *          textField="text"
   *      >
   *      </tri-treeview>
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
  focus(index: string) {
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
  itemLookup(index: string) {
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
  expandNode(item: any, index: string) {
    this.expandService.expand(index, item);
  }

  /**
   * Triggers the `collapse` event for the provided node.
   */
  collapseNode(item: any, index: string) {
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
  getNodePageSize(dataItem: any) {
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
  setNodePageSize(dataItem: any, pageSize: number) {
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

  attachDomHandlers(): any {
    const element     = this.element.nativeElement;
    this.clickHandler = this.clickHandler.bind(this);
    this.domSubscriptions.push(this.renderer.listen(element, 'contextmenu', this.clickHandler),
      this.renderer.listen(element, 'click', this.clickHandler),
      this.renderer.listen(element, 'dblclick', this.clickHandler),
      this.renderer.listen(element, 'focusin', this.focusHandler.bind(this)),
      this.renderer.listen(element, 'focusout', this.blurHandler.bind(this)),
      this.renderer.listen(element, 'keydown', this.keydownHandler.bind(this)));
  }

  focusHandler(e): any {
    let focusItem;
    if (match(e.target, '.k-treeview-item')) {
      focusItem = e.target;
    } else if (!isFocusable(e.target)) { // with compliments to IE
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

  blurHandler(e): any {
    if (this.isActive && match(e.target, '.k-treeview-item') &&
      (!e.relatedTarget || !match(e.relatedTarget, '.k-treeview-item') || !hasParent(
        e.relatedTarget, this.element.nativeElement))) {
      this.navigationService.deactivate();
      this.isActive = false;
      if (hasObservers(this.onBlur)) {
        this.ngZone.run(() => {
          this.onBlur.emit();
        });
      }
    }
  }

  clickHandler(e): any {
    const target = e.target;
    if ((e.type === 'contextmenu' && !hasObservers(this.nodeClick)) ||
      (e.type === 'click' && !hasObservers(this.nodeClick) && !hasObservers(
        this.selectionChange) && !isLoadMoreButton(target)) ||
      (e.type === 'dblclick' && !hasObservers(this.nodeDblClick)) || isFocusable(target) ||
      (!isContent(target) && !isLoadMoreButton(target)) || !hasParent(target,
        this.element.nativeElement)) {
      return;
    }
    const index = nodeId(closestNode(target));
    // the disabled check is probably not needed due to the k-disabled styles
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
        } else {
          this.navigationService.selectIndex(index);
        }
      }
      const emitter = e.type === 'dblclick' ? this.nodeDblClick : this.nodeClick;
      emitter.emit({
        item         : lookup.item,
        originalEvent: e,
        type         : e.type
      });
    });
  }

  keydownHandler(e): any {
    if (this.isActive && this.navigable) {
      this.ngZone.run(() => {
        this.navigationService.move(e);
      });
    }
  }

  verifyLoadMoreService(): any {
    if (isDevMode() && !isPresent(this.loadMoreService)) {
      throw new Error(
        `To use the TreeView paging functionality, you need to assign the \`kendoTreeViewLoadMore\` directive.`);
    }
  }

  registerLookupItems(data, parentItem = null): any {
    if (!isPresent(data) || data.length === 0) {
      return;
    }
    const parentIndex = nodeIndex(parentItem);
    const treeItems   = data.map((node, index) => buildTreeItem(node, index, parentIndex));
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
}
