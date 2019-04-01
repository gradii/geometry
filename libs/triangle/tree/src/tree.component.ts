import { isPresent } from '@gradii/triangle/util';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChange,
  TemplateRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormatBeforeDropEvent, FormatEmitEvent } from './interface';
import { TreeNode } from './tree-node';
import { TreeService } from './tree.service';

@Component({
  selector       : 'tri-tree',
  template       : `
    <ul
      role="tree"
      unselectable="on"
      [ngClass]="classMap">
      <ng-container *ngFor="let node of nodes">
        <tri-tree-node
          [treeNode]="node"
          [selectMode]="selectMode"
          [showLine]="showLine"
          [draggable]="draggable"
          [checkable]="checkable"
          [showExpand]="showExpand"
          [asyncData]="asyncData"
          [searchValue]="searchValue"
          [hideUnMatched]="hideUnMatched"
          [beforeDrop]="beforeDrop"
          [checkStrictly]="checkStrictly"
          [expandAll]="expandAll"
          [showIcon]="showIcon"
          [treeTemplate]="treeTemplate">
        </tri-tree-node>
      </ng-container>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers      : [
    TreeService,
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeComponent),
      multi      : true
    }
  ]
})

export class TreeComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() showIcon = false;
  @Input() showLine = false;
  @Input() checkStrictly = false;
  @Input() checkable = false;
  @Input() showExpand = true;
  @Input() asyncData = false;
  @Input() draggable = false;
  @Input() expandAll = false;
  @Input() hideUnMatched = false;
  @Input() selectMode = false;
  @Input() beforeDrop: (confirm: FormatBeforeDropEvent) => Observable<boolean>;

  @Input()
  set multiple(value: boolean) {
    this._multiple = value;
    this.treeService.isMultiple = value;
  }

  get multiple(): boolean {
    return this._multiple;
  }

  @Input()
  // tslint:disable-next-line:no-any
  set dataSource(value: any[]) {
    if (Array.isArray(value)) {
      if (!this.treeService.isArrayOfTreeNode(value)) {
        // has not been new TreeNode
        this.nodes = value.map(item => (new TreeNode(item, undefined, this.treeService)));
      } else {
        this.nodes = value.map((item: TreeNode) => {
          item.service = this.treeService;
          return item;
        });
      }
      this.treeService.isCheckStrictly = this.checkStrictly;
      this.treeService.isMultiple = this.multiple;
      this.treeService.initTree(this.nodes);
    } else {
      if (value !== null) {
        console.warn('ngModel only accepts an array and must be not empty');
      }
    }
  }


  @Input()
  set expandedKeys(value: string[]) {
    this.defaultSubject.next({type: 'expandedKeys', keys: value});
  }

  @Input()
  set selectedKeys(value: string[]) {
    this.defaultSubject.next({type: 'selectedKeys', keys: value});
  }

  @Input()
  set checkedKeys(value: string[]) {
    this.defaultSubject.next({type: 'checkedKeys', keys: value});
  }

  @Input()
  set searchValue(value: string) {
    this._searchValue = value;
    this.treeService.searchExpand(value);
    if (isPresent(value)) {
      this.searchValueChange.emit(this.treeService.formatEvent('search'));
      this.onSearchNode.emit(this.treeService.formatEvent('search'));
    }
  }

  get searchValue(): string {
    return this._searchValue;
  }

  // model bind
  @Output() readonly expandedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() readonly selectedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() readonly checkedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output() readonly searchValueChange = new EventEmitter<FormatEmitEvent>();
  /**
   * @deprecated use
   * searchValueChange instead
   */
  @Output() readonly onSearchNode = new EventEmitter<FormatEmitEvent>();

  @Output() readonly click = new EventEmitter<FormatEmitEvent>();
  @Output() readonly dblClick = new EventEmitter<FormatEmitEvent>();
  @Output() readonly contextMenu = new EventEmitter<FormatEmitEvent>();
  @Output() readonly checkBoxChange = new EventEmitter<FormatEmitEvent>();
  @Output() readonly expandChange = new EventEmitter<FormatEmitEvent>();

  @Output() readonly onDragStart = new EventEmitter<FormatEmitEvent>();
  @Output() readonly onDragEnter = new EventEmitter<FormatEmitEvent>();
  @Output() readonly onDragOver = new EventEmitter<FormatEmitEvent>();
  @Output() readonly onDragLeave = new EventEmitter<FormatEmitEvent>();
  @Output() readonly onDrop = new EventEmitter<FormatEmitEvent>();
  @Output() readonly onDragEnd = new EventEmitter<FormatEmitEvent>();
  // tslint:disable-next-line:no-any
  @ContentChild('treeTemplate') treeTemplate: TemplateRef<any>;
  _searchValue = '';
  _multiple: boolean = false;
  defaultSubject = new ReplaySubject<{ type: string, keys: string[] }>(6);
  destroy$: Subject<void> | null = new Subject();
  defaultSubscription: Subscription | null;
  nodes: TreeNode[] = [];
  prefixCls = 'tri-tree';
  classMap = {};

  onChange: (value: TreeNode[]) => void = () => null;
  onTouched: () => void = () => null;

  getTreeNodes(): TreeNode[] {
    return this.treeService.rootNodes;
  }

  getTreeNodeByKey(key: string): TreeNode | null {
    let targetNode: TreeNode | null = null;
    const getNode = (node: TreeNode): boolean => {
      if (node.key === key) {
        targetNode = node;
        // break every
        return false;
      } else {
        node.getChildren().every(n => {
          return getNode(n);
        });
      }
      return true;
    };
    this.nodes.every(n => {
      return getNode(n);
    });
    return targetNode;
  }

  /**
   * public function
   */
  getCheckedNodeList(): TreeNode[] {
    return this.treeService.getCheckedNodeList();
  }

  getSelectedNodeList(): TreeNode[] {
    return this.treeService.getSelectedNodeList();
  }

  getHalfCheckedNodeList(): TreeNode[] {
    return this.treeService.getHalfCheckedNodeList();
  }

  getExpandedNodeList(): TreeNode[] {
    return this.treeService.getExpandedNodeList();
  }

  getMatchedNodeList(): TreeNode[] {
    return this.treeService.getMatchedNodeList();
  }

  setClassMap(): void {
    this.classMap = {
      [this.prefixCls]               : true,
      [this.prefixCls + '-show-line']: this.showLine,
      [`${this.prefixCls}-icon-hide`]: !this.showIcon,
      ['draggable-tree']             : this.draggable,
      ['tri-select-tree']            : this.selectMode
    };
  }

  writeValue(value: TreeNode[]): void {
    if (Array.isArray(value)) {
      this.nodes = value.map((item: TreeNode) => {
        item.service = this.treeService;
        return item;
      });
      this.treeService.isCheckStrictly = this.checkStrictly;
      this.treeService.isMultiple = this.multiple;
      this.treeService.initTree(this.nodes);
      this.cdr.markForCheck();
    } else {
      if (value !== null) {
        console.warn('ngModel only accepts an array and should be not empty');
      }
    }
  }

  registerOnChange(fn: (_: TreeNode[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  constructor(
    public treeService: TreeService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.setClassMap();
    this.defaultSubscription = this.defaultSubject.subscribe((data: { type: string, keys: string[] }) => {
      if (!data || !data.keys) {
        return;
      }
      switch (data.type) {
        case 'expandedKeys':
          this.treeService.calcExpandedKeys(data.keys, this.nodes);
          this.expandedKeysChange.emit(data.keys);
          break;
        case 'selectedKeys':
          this.treeService.calcSelectedKeys(data.keys, this.nodes, this.multiple);
          this.selectedKeysChange.emit(data.keys);
          break;
        case 'checkedKeys':
          this.treeService.calcCheckedKeys(data.keys, this.nodes, this.checkStrictly);
          this.checkedKeysChange.emit(data.keys);
          break;
      }
      this.cdr.markForCheck();
    });
    this.treeService.eventTriggerChanged().pipe(
      takeUntil(this.destroy$!)
    ).subscribe(data => {
      switch (data.eventName) {
        case 'expand':
          this.expandChange.emit(data);
          break;
        case 'click':
          this.click.emit(data);
          break;
        case 'check':
          this.checkBoxChange.emit(data);
          break;
        case 'dblclick':
          this.dblClick.emit(data);
          break;
        case 'contextmenu':
          this.contextMenu.emit(data);
          break;
        // drag drop
        case 'dragstart':
          this.onDragStart.emit(data);
          break;
        case 'dragenter':
          this.onDragEnter.emit(data);
          break;
        case 'dragover':
          this.onDragOver.emit(data);
          break;
        case 'dragleave':
          this.onDragLeave.emit(data);
          break;
        case 'drop':
          this.onDrop.emit(data);
          break;
        case 'dragend':
          this.onDragEnd.emit(data);
          break;
      }
    });
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    if (changes.checkStrictly) {
      this.treeService.isCheckStrictly = changes.checkStrictly.currentValue;
    }
    if (changes.multiple) {
      this.treeService.isMultiple = changes.multiple.currentValue;
    }
  }

  ngOnDestroy(): void {
    this.destroy$!.next();
    this.destroy$!.complete();
    this.destroy$ = null;
    if (this.defaultSubscription) {
      this.defaultSubscription.unsubscribe();
      this.defaultSubscription = null;
    }
  }
}
