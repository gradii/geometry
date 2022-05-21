/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  TemplateRef,
  TrackByFunction
} from '@angular/core';
import { ExpandStateService } from './expand-state.service';
import { IndexBuilderService } from './index-builder.service';
import { TreeViewLookupService } from './treeview-lookup.service';
import { NavigationService } from './navigation/navigation.service';
import { NodeChildrenService } from './node-children.service';
import { LoadMoreService } from './load-more/load-more.service';
import { LoadingNotificationService } from './loading-notification.service';
import { CheckedState } from './checkbox/checked-state';
import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { DataChangeNotificationService } from './data-change-notification.service';
import { TreeViewSize } from './size';
import { animate, style, transition, trigger } from '@angular/animations';
import { getter } from '@gradii/nanofn';
import { isArray, isPresent } from './utils';
import { catchError, filter, finalize, tap } from 'rxjs/operators';

@Component({
  animations: [
    trigger('toggle', [
      transition('void => *', [
        style({height: 0}),
        animate('0.1s ease-in', style({height: '*'}))
      ]),
      transition('* => void', [
        style({height: '*'}),
        animate('0.1s ease-in', style({height: 0}))
      ])
    ])
  ],
  selector  : '[triTreeViewGroup]',
  template  : `
    <li
      *ngFor="let node of data; let index = index; trackBy: trackBy"
      class="k-treeview-item"
      [class.k-display-none]="!isVisible(node, nodeIndex(index))"
      triTreeViewItem
      [attr.aria-setsize]="totalNodesCount"
      [dataItem]="node"
      [index]="nodeIndex(index)"
      [parentDataItem]="parentDataItem"
      [parentIndex]="parentIndex"
      [loadOnDemand]="loadOnDemand"
      [checkable]="checkboxes"
      [isChecked]="isChecked(node, nodeIndex(index))"
      [isDisabled]="disabled || isDisabled(node, nodeIndex(index))"
      [isVisible]="isVisible(node, nodeIndex(index))"
      [expandable]="expandIcons && hasChildren(node)"
      [isExpanded]="isExpanded(node, nodeIndex(index))"
      [selectable]="selectable"
      [isSelected]="isSelected(node, nodeIndex(index))"
      [attr.data-treeindex]="nodeIndex(index)"
    >
      <div class="k-treeview-mid">
        <span
          class="k-treeview-toggle"
          [triTreeViewLoading]="nodeIndex(index)"
          (click)="expandNode(nodeIndex(index), node, !isExpanded(node, nodeIndex(index)))"
          *ngIf="expandIcons && hasChildren(node)"
        >
          <span
            class="k-icon"
            [class.k-i-collapse]="isExpanded(node, nodeIndex(index))"
            [class.k-i-expand]="!isExpanded(node, nodeIndex(index))"
          >
          </span>
        </span>
        <tri-checkbox
          *ngIf="checkboxes"
          [size]="size"
          [node]="node"
          [index]="nodeIndex(index)"
          [isChecked]="isChecked"
          (checkStateChange)="checkNode(nodeIndex(index))"
          [attr.tabindex]="-1"
        ></tri-checkbox>
        <span triTreeViewItemContent
              [attr.data-treeindex]="nodeIndex(index)"
              [dataItem]="node"
              [index]="nodeIndex(index)"
              [initialSelection]="isSelected(node, nodeIndex(index))"
              [isSelected]="isSelected"
              class="k-treeview-leaf"
              [style.touch-action]="touchActions ? '' : 'none'"
        >
          <span class="k-treeview-leaf-text">
            <ng-container [ngSwitch]="hasTemplate">
              <ng-container *ngSwitchCase="true">
                <ng-template
                  [ngTemplateOutlet]="nodeTemplateRef"
                  [ngTemplateOutletContext]="{
                        $implicit: node,
                        index: nodeIndex(index)
                    }"
                >
                </ng-template>
              </ng-container>
              <ng-container *ngSwitchDefault>
                  {{nodeText(node)}}
              </ng-container>
            </ng-container>
          </span>
      </span>
      </div>
      <ul
        *ngIf="isExpanded(node, nodeIndex(index)) && hasChildren(node)"
        triTreeViewGroup
        role="group"
        [nodes]="fetchChildren"
        [loadOnDemand]="loadOnDemand"
        [checkboxes]="checkboxes"
        [expandIcons]="expandIcons"
        [selectable]="selectable"
        [touchActions]="touchActions"
        [children]="children"
        [hasChildren]="hasChildren"
        [isChecked]="isChecked"
        [isDisabled]="isDisabled"
        [disabled]="disabled || isDisabled(node, nodeIndex(index))"
        [isExpanded]="isExpanded"
        [isSelected]="isSelected"
        [isVisible]="isVisible"
        [nodeTemplateRef]="nodeTemplateRef"
        [loadMoreButtonTemplateRef]="loadMoreButtonTemplateRef"
        [parentIndex]="nodeIndex(index)"
        [parentDataItem]="node"
        [textField]="nextFields"
        [loadMoreService]="loadMoreService"
        [@toggle]="true"
        [trackBy]="trackBy"
      >
      </ul>
    </li>
    <li
      *ngIf="initialNodesLoaded && moreNodesAvailable"
      class="k-treeview-item"
      [class.k-treeview-load-more-checkboxes-container]="checkboxes"
      triTreeViewItem
      role="button"
      [selectable]="false"
      [checkable]="false"
      [expandable]="false"
      [index]="loadMoreButtonIndex"
      [parentDataItem]="parentDataItem"
      [parentIndex]="parentIndex"
      [attr.data-treeindex]="loadMoreButtonIndex"
    >
      <div class="k-treeview-mid">
                <span
                  *ngIf="loadingMoreNodes"
                  class="k-icon k-i-loading k-i-expand"
                >
                </span>
        <span
          class="k-treeview-leaf k-treeview-load-more-button"
          [attr.data-treeindex]="loadMoreButtonIndex"
          triTreeViewItemContent
          [index]="loadMoreButtonIndex"
        >
                    <span class="k-treeview-leaf-text">
                        <ng-template
                          *ngIf="loadMoreButtonTemplateRef"
                          [ngTemplateOutlet]="loadMoreButtonTemplateRef"
                          [ngTemplateOutletContext]="{
                                index: loadMoreButtonIndex
                            }"
                        >
                        </ng-template>
                        <ng-container *ngIf="!loadMoreButtonTemplateRef">
                            Load more
                        </ng-container>
                    </span>
                </span>
      </div>
    </li>
  `,
  host      : {
    '[class.k-treeview-group]': 'kGroupClass',
    '[attr.role]'             : 'role',
  }
})
export class TreeViewGroupComponent implements OnChanges, OnInit, OnDestroy {
  expandService: ExpandStateService;
  loadingService: LoadingNotificationService;
  indexBuilder: IndexBuilderService;
  treeViewLookupService: TreeViewLookupService;
  navigationService: NavigationService;
  nodeChildrenService: NodeChildrenService;
  dataChangeNotification: DataChangeNotificationService;
  changeDetectorRef: ChangeDetectorRef;
  kGroupClass: boolean;
  role: string;
  @Input()
  checkboxes: boolean;
  @Input()
  expandIcons: boolean;
  @Input()
  disabled: boolean;
  @Input()
  selectable: boolean;
  @Input()
  touchActions: boolean;
  @Input()
  loadOnDemand: boolean;
  @Input()
  trackBy: TrackByFunction<object>;
  @Input()
  nodes: (node: any, index: string) => Observable<any[]>;
  @Input()
  textField: string | string[];
  @Input()
  parentDataItem: any;
  @Input()
  parentIndex: string;
  @Input()
  nodeTemplateRef: TemplateRef<any>;
  @Input()
  loadMoreButtonTemplateRef: TemplateRef<any>;
  @Input()
  loadMoreService: LoadMoreService;
  @Input()
  size: TreeViewSize;
  initialNodesLoaded: boolean;
  loadingMoreNodes: boolean;
  _data: any;
  nodesSubscription: any;
  loadMoreNodesSubscription: any;
  singleRecordSubscriptions: any;

  @Input()
  isChecked: (item: object, index: string) => CheckedState;
  @Input()
  isDisabled: (item: object, index: string) => boolean;
  @Input()
  isExpanded: (item: object, index: string) => boolean;
  @Input()
  isVisible: (item: object, index: string) => boolean;
  @Input()
  isSelected: (item: object, index: string) => boolean;
  @Input()
  children: (item: object) => Observable<any[]>;
  @Input()
  hasChildren: (item: object) => boolean;

  constructor(expandService: ExpandStateService, loadingService: LoadingNotificationService,
              indexBuilder: IndexBuilderService, treeViewLookupService: TreeViewLookupService,
              navigationService: NavigationService, nodeChildrenService: NodeChildrenService,
              dataChangeNotification: DataChangeNotificationService,
              changeDetectorRef: ChangeDetectorRef) {
    this.expandService             = expandService;
    this.loadingService            = loadingService;
    this.indexBuilder              = indexBuilder;
    this.treeViewLookupService     = treeViewLookupService;
    this.navigationService         = navigationService;
    this.nodeChildrenService       = nodeChildrenService;
    this.dataChangeNotification    = dataChangeNotification;
    this.changeDetectorRef         = changeDetectorRef;
    this.kGroupClass               = true;
    this.role                      = 'group';
    this.loadOnDemand              = true;
    this.textField                 = '';
    this.size                      = 'medium';
    this.initialNodesLoaded        = false;
    this.loadingMoreNodes          = false;
    this._data                     = [];
    this.singleRecordSubscriptions = new Subscription();
    this.isChecked                 = () => 'none';
    this.isDisabled                = () => false;
    this.isExpanded                = () => false;
    this.isVisible                 = () => true;
    this.isSelected                = () => false;
    this.children                  = () => of([]);
    this.hasChildren               = () => false;
  }

  get moreNodesAvailable(): boolean {
    if (!isPresent(this.loadMoreService) || this.data.length === 0) {
      return false;
    }
    return this.pageSize < this.totalNodesCount;
  }

  get pageSize(): number {
    if (!isPresent(this.loadMoreService)) {
      return null;
    }
    return this.loadMoreService.getGroupSize(this.parentDataItem);
  }

  set pageSize(pageSize: number) {
    this.loadMoreService.setGroupSize(this.parentDataItem, pageSize);
  }

  get data(): any[] {
    if (isPresent(this.pageSize)) {
      const normalizedSizeValue = this.pageSize > 0 ? this.pageSize : 0;
      return this._data.slice(0, normalizedSizeValue);
    }
    return this._data;
  }

  set data(data: any[]) {
    this._data = data;
    this.registerLoadedNodes(this.data);
  }

  get loadMoreButtonIndex(): string {
    if (!this.loadMoreService) {
      return null;
    }
    return this.nodeIndex(this.data.length);
  }

  /**
   * Represents the total number of nodes for the current level.
   */
  get totalNodesCount(): number {
    if (!this.loadMoreService) {
      return this.data.length;
    }
    return this.loadMoreService.getTotalNodesCount(this.parentDataItem, this._data.length);
  }

  get hasTemplate(): boolean {
    return isPresent(this.nodeTemplateRef);
  }

  expandNode(index: string, dataItem: any, expand: boolean) {
    if (expand) {
      this.expandService.expand(index, dataItem);
    } else {
      this.expandService.collapse(index, dataItem);
    }
  }

  checkNode(index: string) {
    this.navigationService.checkIndex(index);
    this.navigationService.activateIndex(index);
  }

  nodeIndex(index: number) {
    return this.indexBuilder.nodeIndex(index.toString(), this.parentIndex);
  }

  nodeText(dataItem: any) {
    const textField: string = isArray(this.textField) ? this.textField[0] : this.textField as string;
    return getter(dataItem, textField);
  }

  ngOnDestroy() {
    if (isPresent(this.nodesSubscription)) {
      this.nodesSubscription.unsubscribe();
    }
    if (isPresent(this.loadMoreNodesSubscription)) {
      this.loadMoreNodesSubscription.unsubscribe();
    }
    this.singleRecordSubscriptions.unsubscribe();
  }

  ngOnInit() {
    this.subscribeToNodesChange();
    this.singleRecordSubscriptions.add(this.dataChangeNotification
      .changes
      .subscribe(this.subscribeToNodesChange.bind(this)));
    this.singleRecordSubscriptions.add(this.navigationService.loadMore
      .pipe(filter(index => index === this.loadMoreButtonIndex))
      .subscribe(this.loadMoreNodes.bind(this)));
  }

  ngOnChanges(changes: any) {
    if (changes.parentIndex && this.loadOnDemand) {
      this.setNodeChildren(this.mapToTreeItem(this.data));
    }
  }

  fetchChildren(node: any, index: string) {
    return this.children(node)
      .pipe(catchError(() => {
        this.loadingService.notifyLoaded(index);
        return EMPTY;
      }), tap(() => this.loadingService.notifyLoaded(index)));
  }

  get nextFields(): string[] {
    if (isArray(this.textField)) {
      return this.textField.length > 1 ? (this.textField as string[]).slice(1) : this.textField as string[];
    }
    return [this.textField as string];
  }

  loadMoreNodes() {
    if (isPresent(this.loadMoreService.loadMoreNodes)) {
      this.fetchMoreNodes();
    } else {
      this.loadMoreLocalNodes();
    }
  }

  loadMoreLocalNodes(): any {
    const initialLoadMoreButtonIndex = this.loadMoreButtonIndex;
    this.pageSize += this.loadMoreService.getInitialPageSize(this.parentDataItem);
    this.registerLoadedNodes(this.data);
    // forces the new items to be registered before the focus is changed
    this.changeDetectorRef.detectChanges();
    this.reselectItemAt(initialLoadMoreButtonIndex);
  }

  fetchMoreNodes(): any {
    if (this.loadingMoreNodes) {
      return;
    }
    this.loadingMoreNodes = true;
    if (isPresent(this.loadMoreNodesSubscription)) {
      this.loadMoreNodesSubscription.unsubscribe();
    }
    this.loadMoreNodesSubscription = this.loadMoreService
      .loadMoreNodes({
        dataItem: this.parentDataItem,
        skip    : this.data.length,
        take    : this.loadMoreService.getInitialPageSize(this.parentDataItem)
      })
      .pipe(finalize(() => this.loadingMoreNodes = false))
      .subscribe(items => {
        if (!(Array.isArray(items) && items.length > 0)) {
          return;
        }
        const initialLoadMoreButtonIndex = this.loadMoreButtonIndex;
        this.pageSize += items.length;
        this.data                        = this.data.concat(items);
        if (this.navigationService.isActive(initialLoadMoreButtonIndex)) {
          // forces the new items to be registered before the focus is changed
          this.changeDetectorRef.detectChanges();
          this.reselectItemAt(initialLoadMoreButtonIndex);
        }
      });
  }

  setNodeChildren(children): any {
    this.treeViewLookupService.registerChildren(this.parentIndex, children);
  }

  mapToTreeItem(data): any {
    if (!this.parentIndex) {
      return [];
    }
    return data.map((dataItem, idx) => ({dataItem, index: this.nodeIndex(idx)}));
  }

  emitChildrenLoaded(children): any {
    if (!this.parentIndex) {
      return;
    }
    // ignores the registered load-more button
    const contentChildren = children.filter(item => item.dataItem);
    this.nodeChildrenService.childrenLoaded({
      dataItem: this.parentDataItem,
      index   : this.parentIndex
    }, contentChildren);
  }

  subscribeToNodesChange(): any {
    if (this.nodesSubscription) {
      this.nodesSubscription.unsubscribe();
    }
    this.nodesSubscription = this.nodes(this.parentDataItem, this.parentIndex)
      .subscribe(data => {
        this.data               = data;
        this.initialNodesLoaded = true;
      });
  }

  reselectItemAt(index): any {
    if (!isPresent(index)) {
      return;
    }
    // make sure the old index is cleared first
    this.navigationService.deactivate();
    this.navigationService.activateIndex(index);
  }

  registerLoadedNodes(nodes = []): any {
    const mappedChildren = this.mapToTreeItem(nodes);
    if (this.loadOnDemand) {
      this.setNodeChildren(mappedChildren);
    }
    this.emitChildrenLoaded(mappedChildren);
  }
}
