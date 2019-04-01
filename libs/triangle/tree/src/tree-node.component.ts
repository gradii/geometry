import { CollapseAnimation } from '@gradii/triangle/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FormatBeforeDropEvent } from './interface';
import { TreeNode } from './tree-node';
import { TreeService } from './tree.service';

@Component({
  selector           : 'tri-tree-node',
  template           : `
    <li
      #dragElement
      role="treeitem"
      [style.display]="displayStyle"
      [ngClass]="nodeClass">
      <ng-container *ngIf="showExpand">
    <span
      [ngClass]="nodeSwitcherClass"
      (click)="_clickExpand($event)">
      <ng-template [ngIf]="!treeNode.isLoading">
        <ng-container *ngIf="isShowSwitchIcon">
          <i class="anticon anticon-caret-down"
             [class.tri-select-switcher-icon]="selectMode"
             [class.tri-tree-switcher-icon]="!selectMode"></i>
        </ng-container>
        <ng-container *ngIf="showLine">
          <i *ngIf="isShowLineIcon" class="anticon tri-tree-switcher-line-icon"
             [ngClass]="isSwitcherOpen ? 'anticon-minus-square-o' : 'anticon-plus-square-o'"></i>
          <i *ngIf="!isShowLineIcon" class="anticon anticon-file tri-tree-switcher-line-icon"></i>
        </ng-container>
      </ng-template>
      <i *ngIf="treeNode.isLoading" class="anticon anticon-spin anticon-loading tri-tree-switcher-loading-icon"></i>
    </span>
      </ng-container>
      <ng-container *ngIf="checkable">
    <span
      [ngClass]="nodeCheckboxClass"
      (click)="_clickCheckBox($event)">
      <span [class.tri-tree-checkbox-inner]="!selectMode"
            [class.tri-select-tree-checkbox-inner]="selectMode"></span>
    </span>
      </ng-container>
      <ng-container *ngIf="!treeTemplate">
    <span
      title="{{treeNode.title}}"
      [attr.draggable]="canDraggable"
      [attr.aria-grabbed]="canDraggable"
      [ngClass]="nodeContentClass"
      [class.draggable]="canDraggable">
      <span
        *ngIf="treeNode.icon && showIcon"
        [class.tri-tree-icon__open]="isSwitcherOpen"
        [class.tri-tree-icon__close]="isSwitcherClose"
        [class.tri-tree-icon_loading]="treeNode.isLoading"
        [ngClass]="nodeContentLoadingClass">
        <span
          [ngClass]="nodeContentIconClass">
          <i *ngIf="icon" class="anticon"></i>
        </span>
      </span>
      <span class="tri-tree-title">
        <ng-container *ngIf="treeNode.isMatched">
          <span>
            {{highlightKeys[0]}}<span class="font-highlight">{{searchValue}}</span>{{highlightKeys[1]}}
          </span>
        </ng-container>
        <ng-container *ngIf="!treeNode.isMatched">
          {{treeNode.title}}
        </ng-container>
      </span>
    </span>
      </ng-container>
      <ng-template
        [ngTemplateOutlet]="treeTemplate"
        [ngTemplateOutletContext]="{ $implicit: treeNode }">
      </ng-template>

      <ul
        role="group"
        class="tri-tree-child-tree"
        [class.tri-tree-child-tree-open]="!selectMode || treeNode.isExpanded"
        data-expanded="true"
        [@collapseAnimation]="treeNode.isExpanded ? 'expanded' : 'collapsed'">
        <tri-tree-node
          *ngFor="let node of treeNode.getChildren()"
          [treeNode]="node"
          [selectMode]="selectMode"
          [showLine]="showLine"
          [draggable]="draggable"
          [checkable]="checkable"
          [showExpand]="showExpand"
          [asyncData]="asyncData"
          [expandAll]="expandAll"
          [showIcon]="showIcon"
          [searchValue]="searchValue"
          [hideUnMatched]="hideUnMatched"
          [beforeDrop]="beforeDrop"
          [checkStrictly]="checkStrictly"
          [treeTemplate]="treeTemplate">
        </tri-tree-node>
      </ul>
    </li>
  `,
  changeDetection    : ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  animations         : [CollapseAnimation]
})

export class TreeNodeComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('dragElement') dragElement: ElementRef;

  /**
   * for global property
   */
  @Input() treeNode: TreeNode;
  @Input() showLine: boolean;
  @Input() showExpand: boolean;
  @Input() checkable: boolean;
  @Input() asyncData: boolean;
  @Input() checkStrictly: boolean;
  @Input() hideUnMatched = false;
  @Input() noAnimation = false;
  @Input() selectMode = false;
  @Input() showIcon = false;
  @Input() treeTemplate: TemplateRef<void>;
  @Input() beforeDrop: (confirm: FormatBeforeDropEvent) => Observable<boolean>;

  @Input()
  set draggable(value: boolean) {
    this._draggable = value;
    this.handDragEvent();
  }

  get draggable(): boolean {
    return this._draggable;
  }

  // default set
  @Input()
  set expandAll(value: boolean) {
    this._expandAll = value;
    if (value && this.treeNode && !this.treeNode.isLeaf) {
      this.treeNode.isExpanded = true;
    }
  }

  get expandAll(): boolean {
    return this._expandAll;
  }

  @Input()
  set searchValue(value: string) {
    this.highlightKeys = [];
    if (value && this.treeNode.title!.includes(value)) {
      // match the search value
      const index = this.treeNode.title.indexOf(value);
      this.highlightKeys = [this.treeNode.title.slice(0, index), this.treeNode.title.slice(index + value.length, this.treeNode.title.length)];
    }
    this._searchValue = value;
  }

  get searchValue(): string {
    return this._searchValue;
  }

  // default var
  prefixCls = 'tri-tree';
  highlightKeys: string[] = [];
  nodeClass = {};
  nodeSwitcherClass = {};
  nodeContentClass = {};
  nodeCheckboxClass = {};
  nodeContentIconClass = {};
  nodeContentLoadingClass = {};

  /**
   * drag var
   */
  destroy$ = new Subject();
  dragPos = 2;
  dragPosClass: { [key: string]: string } = {
    '0' : 'drag-over',
    '1' : 'drag-over-gap-bottom',
    '-1': 'drag-over-gap-top'
  };

  /**
   * default set
   */
  _searchValue = '';
  _draggable = false;
  _expandAll = false;

  get icon(): string {
    return this.treeNode.icon;
  }

  get canDraggable(): boolean | null {
    return (this.draggable && !this.treeNode.isDisabled) ? true : null;
  }

  get isShowLineIcon(): boolean {
    return !this.treeNode.isLeaf && this.showLine;
  }

  get isShowSwitchIcon(): boolean {
    return !this.treeNode.isLeaf && !this.showLine;
  }

  get isSwitcherOpen(): boolean {
    return (this.treeNode.isExpanded && !this.treeNode.isLeaf);
  }

  get isSwitcherClose(): boolean {
    return (!this.treeNode.isExpanded && !this.treeNode.isLeaf);
  }

  get displayStyle(): string {
    // to hide unmatched nodes
    return (this.searchValue && this.hideUnMatched && !this.treeNode.isMatched && !this.treeNode.isExpanded) ? 'none' : '';
  }

  /**
   * reset node class
   */
  setClassMap(): void {
    this.prefixCls = this.selectMode ? 'tri-select-tree' : 'tri-tree';
    this.nodeClass = {
      [`${this.prefixCls}-treenode-disabled`]              : this.treeNode.isDisabled,
      [`${this.prefixCls}-treenode-switcher-open`]         : this.isSwitcherOpen,
      [`${this.prefixCls}-treenode-switcher-close`]        : this.isSwitcherClose,
      [`${this.prefixCls}-treenode-checkbox-checked`]      : this.treeNode.isChecked,
      [`${this.prefixCls}-treenode-checkbox-indeterminate`]: this.treeNode.isHalfChecked,
      [`${this.prefixCls}-treenode-selected`]              : this.treeNode.isSelected,
      [`${this.prefixCls}-treenode-loading`]               : this.treeNode.isLoading
    };
    this.nodeSwitcherClass = {
      [`${this.prefixCls}-switcher`]      : true,
      [`${this.prefixCls}-switcher-noop`] : this.treeNode.isLeaf,
      [`${this.prefixCls}-switcher_open`] : this.isSwitcherOpen,
      [`${this.prefixCls}-switcher_close`]: this.isSwitcherClose
    };

    this.nodeCheckboxClass = {
      [`${this.prefixCls}-checkbox`]              : true,
      [`${this.prefixCls}-checkbox-checked`]      : this.treeNode.isChecked,
      [`${this.prefixCls}-checkbox-indeterminate`]: this.treeNode.isHalfChecked,
      [`${this.prefixCls}-checkbox-disabled`]     : this.treeNode.isDisabled || this.treeNode.isDisableCheckbox
    };

    this.nodeContentClass = {
      [`${this.prefixCls}-node-content-wrapper`]      : true,
      [`${this.prefixCls}-node-content-wrapper-open`] : this.isSwitcherOpen,
      [`${this.prefixCls}-node-content-wrapper-close`]: this.isSwitcherClose,
      [`${this.prefixCls}-node-selected`]             : this.treeNode.isSelected
    };
    this.nodeContentIconClass = {
      [`${this.prefixCls}-iconEle`]        : true,
      [`${this.prefixCls}-icon__customize`]: true
    };
    this.nodeContentLoadingClass = {
      [`${this.prefixCls}-iconEle`]: true
    };
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent): void {
    if (this.selectMode) {
      event.preventDefault();
    }
  }

  /**
   * click node to select, 200ms to dbl click
   */
  @HostListener('click', ['$event'])
  click(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.treeNode.isSelectable && !this.treeNode.isDisabled) {
      this.treeNode.isSelected = !this.treeNode.isSelected;
    }
    const eventNext = this.treeService.formatEvent('click', this.treeNode, event);
    this.treeService!.triggerEventChange$!.next(eventNext);
  }

  @HostListener('dblclick', ['$event'])
  dblClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const eventNext = this.treeService.formatEvent('dblclick', this.treeNode, event);
    this.treeService!.triggerEventChange$!.next(eventNext);
  }

  /**
   * @param event
   */
  @HostListener('contextmenu', ['$event'])
  contextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const eventNext = this.treeService.formatEvent('contextmenu', this.treeNode, event);
    this.treeService!.triggerEventChange$!.next(eventNext);
  }

  /**
   * collapse node
   * @param event
   */
  _clickExpand(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.treeNode.isLoading && !this.treeNode.isLeaf) {
      // set async state
      if (this.asyncData && this.treeNode.children.length === 0 && !this.treeNode.isExpanded) {
        this.treeNode.isLoading = true;
      }
      this.treeNode.isExpanded = !this.treeNode.isExpanded;
      const eventNext = this.treeService.formatEvent('expand', this.treeNode, event);
      this.treeService!.triggerEventChange$!.next(eventNext);
    }
  }

  /**
   * check node
   * @param event
   */
  _clickCheckBox(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // return if node is disabled
    if (this.treeNode.isDisabled || this.treeNode.isDisableCheckbox) {
      return;
    }
    this.treeNode.isChecked = !this.treeNode.isChecked;
    this.treeNode.isHalfChecked = false;
    if (!this.treeService.isCheckStrictly) {
      this.treeService.conduct(this.treeNode);
    }
    const eventNext = this.treeService.formatEvent('check', this.treeNode, event);
    this.treeService!.triggerEventChange$!.next(eventNext);
  }

  /**
   * drag event
   * @param e
   */
  clearDragClass(): void {
    const dragClass = ['drag-over-gap-top', 'drag-over-gap-bottom', 'drag-over'];
    dragClass.forEach(e => {
      this.renderer.removeClass(this.dragElement.nativeElement, e);
    });
  }

  handleDragStart(e: DragEvent): void {
    e.stopPropagation();
    try {
      // ie throw error
      // firefox-need-it
      e.dataTransfer!.setData('text/plain', this.treeNode.key!);
    } catch (error) {
      // empty
    }
    this.treeService.setSelectedNode(this.treeNode);
    this.treeNode.isExpanded = false;
    const eventNext = this.treeService.formatEvent('dragstart', this.treeNode, e);
    this.treeService!.triggerEventChange$!.next(eventNext);
  }

  handleDragEnter(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    // reset position
    this.dragPos = 2;
    this.ngZone.run(() => {
      const node = this.treeService.getSelectedNode();
      if (node && node.key !== this.treeNode.key && !this.treeNode.isExpanded && !this.treeNode.isLeaf) {
        this.treeNode.isExpanded = true;
      }
      const eventNext = this.treeService.formatEvent('dragenter', this.treeNode, e);
      this.treeService!.triggerEventChange$!.next(eventNext);
    });
  }

  handleDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const dropPosition = this.treeService.calcDropPosition(e);
    if (this.dragPos !== dropPosition) {
      this.clearDragClass();
      this.dragPos = dropPosition;
      // leaf node will pass
      if (!(this.dragPos === 0 && this.treeNode.isLeaf)) {
        this.renderer.addClass(this.dragElement.nativeElement, this.dragPosClass[this.dragPos]);
      }
    }
    const eventNext = this.treeService.formatEvent('dragover', this.treeNode, e);
    this.treeService!.triggerEventChange$!.next(eventNext);
  }

  handleDragLeave(e: DragEvent): void {
    e.stopPropagation();
    this.ngZone.run(() => {
      this.clearDragClass();
    });
    const eventNext = this.treeService.formatEvent('dragleave', this.treeNode, e);
    this.treeService!.triggerEventChange$!.next(eventNext);
  }

  handleDragDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.ngZone.run(() => {
      this.clearDragClass();
      const node = this.treeService.getSelectedNode();
      if (!node || (node && node.key === this.treeNode.key) || (this.dragPos === 0 && this.treeNode.isLeaf)) {
        return;
      }
      // pass if node is leafNo
      const dropEvent = this.treeService.formatEvent('drop', this.treeNode, e);
      const dragEndEvent = this.treeService.formatEvent('dragend', this.treeNode, e);
      if (this.beforeDrop) {
        this.beforeDrop({
          dragNode: this.treeService.getSelectedNode()!,
          node    : this.treeNode,
          pos     : this.dragPos
        }).subscribe((canDrop: boolean) => {
          if (canDrop) {
            this.treeService.dropAndApply(this.treeNode, this.dragPos);
          }
          this.treeService!.triggerEventChange$!.next(dropEvent);
          this.treeService!.triggerEventChange$!.next(dragEndEvent);
        });
      } else if (this.treeNode) {
        this.treeService.dropAndApply(this.treeNode, this.dragPos);
        this.treeService!.triggerEventChange$!.next(dropEvent);
      }
    });
  }

  handleDragEnd(e: DragEvent): void {
    e.stopPropagation();
    this.ngZone.run(() => {
      // if user do not custom beforeDrop
      if (!this.beforeDrop) {
        this.treeService.setSelectedNode(undefined);
        const eventNext = this.treeService.formatEvent('dragend', this.treeNode, e);
        this.treeService!.triggerEventChange$!.next(eventNext);
      }
    });
  }

  /**
   * 监听拖拽事件
   */
  handDragEvent(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.draggable) {
        this.destroy$ = new Subject();
        fromEvent<DragEvent>(this.elRef.nativeElement, 'dragstart').pipe(takeUntil(this.destroy$)).subscribe((e: DragEvent) => this.handleDragStart(e));
        fromEvent<DragEvent>(this.elRef.nativeElement, 'dragenter').pipe(takeUntil(this.destroy$)).subscribe((e: DragEvent) => this.handleDragEnter(e));
        fromEvent<DragEvent>(this.elRef.nativeElement, 'dragover').pipe(takeUntil(this.destroy$)).subscribe((e: DragEvent) => this.handleDragOver(e));
        fromEvent<DragEvent>(this.elRef.nativeElement, 'dragleave').pipe(takeUntil(this.destroy$)).subscribe((e: DragEvent) => this.handleDragLeave(e));
        fromEvent<DragEvent>(this.elRef.nativeElement, 'drop').pipe(takeUntil(this.destroy$)).subscribe((e: DragEvent) => this.handleDragDrop(e));
        fromEvent<DragEvent>(this.elRef.nativeElement, 'dragend').pipe(takeUntil(this.destroy$)).subscribe((e: DragEvent) => this.handleDragEnd(e));
      } else {
        this.destroy$.next();
        this.destroy$.complete();
      }
    });
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  constructor(
    public treeService: TreeService,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    // init expanded / selected / checked list
    if (this.treeNode.isSelected) {
      this.treeService.setNodeActive(this.treeNode);
    }
    if (this.treeNode.isExpanded) {
      this.treeService.setExpandedNodeList(this.treeNode);
    }
    if (this.treeNode.isChecked) {
      this.treeService.setCheckedNodeList(this.treeNode);
    }
    // TODO
    this.treeNode.component = this;
    this.treeService.eventTriggerChanged().pipe(
      filter(data => data.node!.key === this.treeNode.key),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setClassMap();
      this.markForCheck();
    });
    this.setClassMap();
  }

  ngOnChanges(): void {
    this.setClassMap();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
