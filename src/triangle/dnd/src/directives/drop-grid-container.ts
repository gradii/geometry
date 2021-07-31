/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  BooleanInput, coerceArray, coerceBooleanProperty, coerceNumberProperty, NumberInput
} from '@angular/cdk/coercion';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, InjectionToken, Input, OnDestroy, OnInit, Optional,
  Output,
  SimpleChanges, SkipSelf, ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil, tap } from 'rxjs/operators';
import { assertElementNode } from '../directives/assertions';
import { TRI_DROP_CONTAINER, TriDropContainer } from '../directives/drop-container';
import { DragDrop } from '../drag-drop';
import { DndContainerRef } from '../drag-drop-ref/dnd-container-ref';
import { DragRef } from '../drag-drop-ref/drag-ref';
import { DropGridContainerRef } from '../drag-drop-ref/drop-grid-container-ref';
import { CompactPosition } from '../drag-grid/compact-position';
import { TriDragGridItemComponent } from '../drag-grid/drag-grid-item.component';
import { CompactType, GridTypes } from '../enum';
import { TriDragDrop, TriDragEnter, TriDragExit } from '../event/drag-events';
import { DragAxis, DragDropConfig, TRI_DRAG_CONFIG } from './config';
import { TRI_DROP_CONTAINER_GROUP, TriDropContainerGroup } from './drop-container-group';


export const TRI_DROP_GRID_CONTAINER_CONFIG = new InjectionToken('tri drop grid container config');


@Component({
  selector     : '[triDropGridContainer], tri-drop-grid-container',
  exportAs     : 'triDropGridContainer',
  template     : `
    <ng-content></ng-content>
  `,
  encapsulation: ViewEncapsulation.None,
  providers    : [
    // Prevent child drop lists from picking up the same group as their parent.
    {provide: TRI_DROP_CONTAINER_GROUP, useValue: undefined},
    {provide: TRI_DROP_CONTAINER, useExisting: TriDropGridContainer},
  ],
  host         : {
    'class'                                           : 'tri-drop-grid-container',
    '[attr.id]'                                       : 'id',
    '[class.tri-drop-container-disabled]'             : 'disabled',
    '[class.tri-drop-container-dragging]'             : '_dropContainerRef.isDragging()',
    '[class.tri-drop-container-receiving]'            : '_dropContainerRef.isReceiving()',
    '[class.tri-drop-grid-container-fit]'             : 'gridType === "fit"',
    '[class.tri-drop-grid-container-scrollVertical]'  : 'gridType === "scrollVertical" || gridType === "verticalFixed"',
    '[class.tri-drop-grid-container-scrollHorizontal]': 'gridType === "scrollHorizontal" || gridType === "horizontalFixed"',
    '[class.tri-drop-grid-container-fixed]'           : 'gridType === "fixed"',
  },
  styles       : [
    `
      .tri-drop-grid-container {
        position: relative;
        box-sizing: border-box;
        background: gray;
        width: 100%;
        height: 100%;
        user-select: none;
        display: block;
      }

      .tri-drop-grid-container-fit {
        overflow-x: hidden;
        overflow-y: hidden;
      }

      .tri-drop-grid-container-scrollVertical {
        overflow-x: hidden;
        overflow-y: auto;
      }

      .tri-drop-grid-container-scrollHorizontal {
        overflow-x: auto;
        overflow-y: hidden;
      }

      .tri-drop-grid-container-fixed {
        overflow: auto;
      }
    `
  ]
})
export class TriDropGridContainer<T = any> extends TriDropContainer implements OnInit, OnDestroy {
  /** Emits when the list has been destroyed. */
  private readonly _destroyed = new Subject<void>();

  /** Whether the element's scrollable parents have been resolved. */
  private _scrollableParentsResolved: boolean;


  /** Reference to the underlying drop list instance. */
  _dropContainerRef: DropGridContainerRef<TriDropGridContainer<T>>;

  /**
   * Other draggable containers that this container is connected to and into which the
   * container's items can be transferred. Can either be references to other drop containers,
   * or their unique IDs.
   */
  @Input('triDropGridContainerConnectedTo')
  connectedTo: (TriDropContainer | string)[] | TriDropContainer | string = [];

  /** Arbitrary data to attach to this container. */
  @Input('triDropGridContainerData')
  data: T;

  @Input('triDropGridContainerHasPadding')
  hasPadding: boolean = false;

  /** Locks the position of the draggable elements inside the container along the specified axis. */
  @Input('triDropGridContainerLockAxis')
  lockAxis: DragAxis;

  @Input('triDropGridContainerGutter')
  gutter: number = 10;

  @Input('triDropGridContainerColumns')
  cols: number = 1;

  @Input('triDropGridContainerRows')
  rows: number = 1;

  @Input('triDropGridContainerMinCols')
  minCols: 1;

  @Input('triDropGridContainerMaxCols')
  maxCols: 100;

  @Input('triDropGridContainerMinRows')
  minRows: 1;

  @Input('triDropGridContainerMaxRows')
  maxRows: 100;

  @Input('triDropGridContainerCompactType')
  compactType: CompactType;

  @Input('triDropGridContainerDisableAutoPositionOnConflict')
  disableAutoPositionOnConflict: boolean;

  @Input('triDropGridContainerGridType')
  gridType: GridTypes = 'fit';

  /** Whether sorting within this drop list is disabled. */
  // @Input('triDropContainerSortingDisabled')
  // sortingDisabled: boolean;

  /**
   * Function that is used to determine whether an item
   * is allowed to be moved into a drop container.
   */
  @Input('triDropGridContainerEnterPredicate')
  enterPredicate: (drag: TriDragGridItemComponent, drop: TriDropGridContainer) => boolean = () => true;

  /** Functions that is used to determine whether an item can be sorted into a particular index. */
  @Input('triDropGridContainerSortPredicate')
  sortPredicate: (index: number, drag: TriDragGridItemComponent, drop: TriDropGridContainer) => boolean = () => true;

  /** Whether to auto-scroll the view when the user moves their pointer close to the edges. */
  @Input('triDropGridContainerAutoScrollDisabled')
  autoScrollDisabled: boolean;

  /** Number of pixels to scroll for each frame when auto-scrolling an element. */
  @Input('triDropGridContainerAutoScrollStep')
  autoScrollStep: number;

  /** Emits when the user drops an item inside the container. */
  @Output('triDropGridContainerDropped')
  readonly dropped: EventEmitter<TriDragDrop<T, any>> = new EventEmitter<TriDragDrop<T, any>>();

  /**
   * Emits when the user has moved a new drag item into this container.
   */
  @Output('triDropGridContainerEntered')
  readonly entered: EventEmitter<TriDragEnter<T>> = new EventEmitter<TriDragEnter<T>>();

  /**
   * Emits when the user removes an item from the container
   * by dragging it into another container.
   */
  @Output('triDropGridContainerExited')
  readonly exited: EventEmitter<TriDragExit<T>> = new EventEmitter<TriDragExit<T>>();

  // /**
  //  * @deprecated will use position strategy. use reposition event
  //  * @breaking-change 1.13.0
  //  */
  // /** Emits as the user is swapping items while actively dragging. */
  // @Output('triDropContainerSorted')
  // readonly sorted: EventEmitter<TriDragSortEvent<T>> = new EventEmitter<TriDragSortEvent<T>>();

  @Output('triDropGridContainerRepositioned')
  readonly repositioned: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Keeps track of the items that are registered with this container. Historically we used to
   * do this with a `ContentChildren` query, however queries don't handle transplanted views very
   * well which means that we can't handle cases like dragging the headers of a `mat-table`
   * correctly. What we do instead is to have the items register themselves with the container
   * and then we sort them based on their position in the DOM.
   */
  private _unsortedItems = new Set<TriDragGridItemComponent>();

  private el: HTMLElement;

  private compactService;

  constructor(
    /** Element that the drop list is attached to. */
    public element: ElementRef<HTMLElement>, dragDrop: DragDrop,
    private _changeDetectorRef: ChangeDetectorRef,
    private _scrollDispatcher: ScrollDispatcher,
    @Optional() private _dir?: Directionality,
    @Optional() @Inject(TRI_DROP_CONTAINER_GROUP) @SkipSelf()
    protected _group?: TriDropContainerGroup<TriDropGridContainer>,
    @Optional() @Inject(TRI_DRAG_CONFIG) config?: DragDropConfig) {
    super(_group);

    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      assertElementNode(element.nativeElement, 'triDropContainer');
    }

    this.el = element.nativeElement;

    this._dropContainerRef      = dragDrop.createDropGridContainerRef(element);
    this._dropContainerRef.data = this;

    if (config) {
      this._assignDefaults(config);
    }

    this._dropContainerRef.enterPredicate = (drag: DragRef<TriDragGridItemComponent>,
                                             drop: DndContainerRef<TriDropGridContainer>) => {
      return this.enterPredicate(drag.data, drop.data);
    };

    this._dropContainerRef.sortPredicate =
      (index: number, drag: DragRef<TriDragGridItemComponent>, drop: DndContainerRef<TriDropGridContainer>) => {
        return this.sortPredicate(index, drag.data, drop.data);
      };

    this._setupInputSyncSubscription(this._dropContainerRef);
    this._handleEvents(this._dropContainerRef);
    TriDropContainer._dropContainers.push(this);


    this.compactService = new CompactPosition(this);
  }

  /** Registers an items with the drop list. */
  addItem(item: TriDragGridItemComponent): void {

    if (item.x === -1 || item.y === -1) {
      this.autoPositionItem(item);
    } else if (this.checkCollision(item)) {
      if (ngDevMode) {
        item.notPlaced = true;
        console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
          JSON.stringify(item, ['cols', 'rows', 'x', 'y']));
      }
      if (!this.disableAutoPositionOnConflict) {
        this.autoPositionItem(item);
      } else {
        item.notPlaced = true;
      }
    }

    this._unsortedItems.add(item);

    // this.calculateLayoutDebounce();

    if (this._dropContainerRef.isDragging()) {
      this._syncItemsWithRef();
    }
  }

  /** Removes an item from the drop list. */
  removeItem(item: TriDragGridItemComponent): void {
    this._unsortedItems.delete(item);

    if (this._dropContainerRef.isDragging()) {
      this._syncItemsWithRef();
    }
  }

  autoPositionItem(item: TriDragGridItemComponent): void {
    if (this.getNextPossiblePosition(item)) {
      item.notPlaced = false;
    } else {
      item.notPlaced = true;
      if (ngDevMode) {
        console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
          JSON.stringify(item, ['cols', 'rows', 'x', 'y']));
      }
    }
  }

  getNextPossiblePosition(newItem: TriDragGridItemComponent,
                          startingFrom: { y?: number, x?: number } = {}): boolean {
    // this.setGridDimensions();
    let rowsIndex = startingFrom.y || 0;
    let colsIndex;
    for (; rowsIndex < this.rows; rowsIndex++) {
      newItem.y = rowsIndex;
      colsIndex = startingFrom.x || 0;
      for (; colsIndex < this.cols; colsIndex++) {
        newItem.x = colsIndex;
        if (!this.checkCollision(newItem)) {
          return true;
        }
      }
    }
    const canAddToRows    = this.maxRows >= this.rows + newItem.rows;
    const canAddToColumns = this.maxCols >= this.cols + newItem.cols;
    const addToRows       = this.rows <= this.cols && canAddToRows;
    if (!addToRows && canAddToColumns) {
      newItem.x = this.cols;
      newItem.y = 0;
      return true;
    } else if (canAddToRows) {
      newItem.y = this.rows;
      newItem.x = 0;
      return true;
    }
    return false;
  }


  getUnSortedItems() {
    return Array.from(this._unsortedItems);
  }

  /** Gets the registered items in the list, sorted by their position in the DOM. */
  getSortedItems(): TriDragGridItemComponent[] {
    return Array.from(this._unsortedItems).sort((a: TriDragGridItemComponent, b: TriDragGridItemComponent) => {
      const documentPosition =
              a._dragRef.getVisibleElement().compareDocumentPosition(
                b._dragRef.getVisibleElement());

      // `compareDocumentPosition` returns a bitmask so we have to use a bitwise operator.
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
      // tslint:disable-next-line:no-bitwise
      return documentPosition & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
  }

  /** Syncs the inputs of the TriDropContainer with the options of the underlying DropContainerRef. */
  private _setupInputSyncSubscription(ref: DropGridContainerRef<TriDropGridContainer>) {
    if (this._dir) {
      this._dir.change
        .pipe(startWith(this._dir.value), takeUntil(this._destroyed))
        .subscribe(value => ref.withDirection(value));
    }

    ref.beforeStarted.subscribe(() => {
      const siblings = coerceArray(this.connectedTo).map(drop => {
        if (typeof drop === 'string') {
          const correspondingDropContainer = TriDropContainer._dropContainers.find(
            list => list.id === drop);

          if (!correspondingDropContainer && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            console.warn(`TriDropContainer could not find connected drop list with id "${drop}"`);
          }

          return correspondingDropContainer!;
        }

        return drop;
      });

      if (this._group) {
        this._group._items.forEach(drop => {
          if (siblings.indexOf(drop) === -1) {
            siblings.push(drop);
          }
        });
      }

      // Note that we resolve the scrollable parents here so that we delay the resolution
      // as long as possible, ensuring that the element is in its final place in the DOM.
      if (!this._scrollableParentsResolved) {
        const scrollableParents = this._scrollDispatcher
          .getAncestorScrollContainers(this.element)
          .map(scrollable => scrollable.getElementRef().nativeElement);
        this._dropContainerRef.withScrollableParents(scrollableParents);

        // Only do this once since it involves traversing the DOM and the parents
        // shouldn't be able to change without the drop list being destroyed.
        this._scrollableParentsResolved = true;
      }

      ref.disabled           = this.disabled;
      ref.lockAxis           = this.lockAxis;
      // ref.sortingDisabled    = coerceBooleanProperty(this.sortingDisabled);
      ref.autoScrollDisabled = coerceBooleanProperty(this.autoScrollDisabled);
      ref.autoScrollStep     = coerceNumberProperty(this.autoScrollStep, 2);
      ref
        .connectedTo(
          siblings.filter(drop => drop && drop !== this).map(list => list._dropContainerRef));
    });
  }

  /**
   * todo remove me specify drop list event
   */
  /** Handles events from the underlying DropContainerRef. */
  private _handleEvents(ref: DndContainerRef<TriDropGridContainer>) {
    ref.beforeStarted.subscribe(() => {
      this._syncItemsWithRef();
      this._changeDetectorRef.markForCheck();
    });

    ref.entered.subscribe(event => {
      this.entered.emit({
        container   : this,
        item        : event.item.data,
        currentIndex: event.currentIndex
      });
    });

    ref.exited.subscribe(event => {
      this.exited.emit({
        container: this,
        item     : event.item.data
      });
      this._changeDetectorRef.markForCheck();
    });

    // ref.sorted.subscribe(event => {
    //   this.sorted.emit({
    //     previousIndex: event.previousIndex,
    //     currentIndex : event.currentIndex,
    //     container    : this,
    //     item         : event.item.data
    //   });
    // });

    ref.dropped.subscribe(event => {
      this.dropped.emit({
        previousIndex         : event.previousIndex,
        currentIndex          : event.currentIndex,
        previousContainer     : event.previousContainer.data,
        container             : event.container.data,
        item                  : event.item.data,
        isPointerOverContainer: event.isPointerOverContainer,
        distance              : event.distance,
        dropPoint             : event.dropPoint
      });

      // Mark for check since all of these events run outside of change
      // detection and we're not guaranteed for something else to have triggered it.
      this._changeDetectorRef.markForCheck();
    });
  }

  /** Assigns the default input values based on a provided config object. */
  private _assignDefaults(config: DragDropConfig) {
    const {
            lockAxis, draggingDisabled, listAutoScrollDisabled
          } = config;

    this.disabled           = draggingDisabled == null ? false : draggingDisabled;
    // this.sortingDisabled    = sortingDisabled == null ? false : sortingDisabled;
    this.autoScrollDisabled = listAutoScrollDisabled == null ? false : listAutoScrollDisabled;

    if (lockAxis) {
      this.lockAxis = lockAxis;
    }
  }

  /** Syncs up the registered drag items with underlying drop list ref. */
  private _syncItemsWithRef() {
    this._dropContainerRef.withItems(this.getSortedItems().map(item => item._dragRef));
  }

  private calculateLayout$ = new Subject();

  calculateLayout() {
    this.calculateLayout$.next();
  }

  _calculateLayout() {
    if (this.compactService) {
      this.compactService.checkCompact(this.compactType);
    }

    this._unsortedItems.forEach(item => {
      item.updateItemSize();
    });

    // this.setGridDimensions();
    // if (this.$options.outerMargin) {
    //   let marginWidth = -this.$options.margin;
    //   if (this.$options.outerMarginLeft !== null) {
    //     marginWidth += this.$options.outerMarginLeft;
    //     this.renderer.setStyle(this.el, 'padding-left', this.$options.outerMarginLeft + 'px');
    //   } else {
    //     marginWidth += this.$options.margin;
    //     this.renderer.setStyle(this.el, 'padding-left', this.$options.margin + 'px');
    //   }
    //   if (this.$options.outerMarginRight !== null) {
    //     marginWidth += this.$options.outerMarginRight;
    //     this.renderer.setStyle(this.el, 'padding-right', this.$options.outerMarginRight + 'px');
    //   } else {
    //     marginWidth += this.$options.margin;
    //     this.renderer.setStyle(this.el, 'padding-right', this.$options.margin + 'px');
    //   }
    //   this.curColWidth = (this.curWidth - marginWidth) / this.columns;
    //   let marginHeight = -this.$options.margin;
    //   if (this.$options.outerMarginTop !== null) {
    //     marginHeight += this.$options.outerMarginTop;
    //     this.renderer.setStyle(this.el, 'padding-top', this.$options.outerMarginTop + 'px');
    //   } else {
    //     marginHeight += this.$options.margin;
    //     this.renderer.setStyle(this.el, 'padding-top', this.$options.margin + 'px');
    //   }
    //   if (this.$options.outerMarginBottom !== null) {
    //     marginHeight += this.$options.outerMarginBottom;
    //     this.renderer.setStyle(this.el, 'padding-bottom', this.$options.outerMarginBottom + 'px');
    //   } else {
    //     marginHeight += this.$options.margin;
    //     this.renderer.setStyle(this.el, 'padding-bottom', this.$options.margin + 'px');
    //   }
    //   this.curRowHeight = ((this.curHeight - marginHeight) / this.rows) * this.$options.rowHeightRatio;
    // } else {
    //   this.curColWidth  = (this.curWidth + this.$options.margin) / this.columns;
    //   this.curRowHeight = ((this.curHeight + this.$options.margin) / this.rows) * this.$options.rowHeightRatio;
    //   this.renderer.setStyle(this.el, 'padding-left', 0 + 'px');
    //   this.renderer.setStyle(this.el, 'padding-right', 0 + 'px');
    //   this.renderer.setStyle(this.el, 'padding-top', 0 + 'px');
    //   this.renderer.setStyle(this.el, 'padding-bottom', 0 + 'px');
    // }
    // this.gridRenderer.updateGridster();
    //
    // if (this.$options.setGridSize) {
    //   this.renderer.addClass(this.el, 'gridSize');
    //   if (!this.mobile) {
    //     this.renderer.setStyle(this.el, 'width',
    //       (this.columns * this.curColWidth + this.$options.margin) + 'px');
    //     this.renderer.setStyle(this.el, 'height',
    //       (this.rows * this.curRowHeight + this.$options.margin) + 'px');
    //   }
    // } else {
    //   this.renderer.removeClass(this.el, 'gridSize');
    //   this.renderer.setStyle(this.el, 'width', '');
    //   this.renderer.setStyle(this.el, 'height', '');
    // }
    // this.updateGrid();
    //
    // let widgetsIndex: number = this.grid.length - 1;
    // let widget: GridsterItemComponentInterface;
    // for (; widgetsIndex >= 0; widgetsIndex--) {
    //   widget = this.grid[widgetsIndex];
    //   widget.setSize();
    //   widget.drag.toggle();
    //   widget.resize.toggle();
    // }

  }

  //
  // setGridDimensions(): void {
  //   this.setGridSize();
  //   if (!this.mobile && this.$options.mobileBreakpoint > this.curWidth) {
  //     this.mobile = !this.mobile;
  //     this.renderer.addClass(this.el, 'mobile');
  //   } else if (this.mobile && this.$options.mobileBreakpoint < this.curWidth) {
  //     this.mobile = !this.mobile;
  //     this.renderer.removeClass(this.el, 'mobile');
  //   }
  //   let rows    = this.$options.minRows;
  //   let columns = this.$options.minCols;
  //
  //   let widgetsIndex = this.grid.length - 1;
  //   let widget;
  //   for (; widgetsIndex >= 0; widgetsIndex--) {
  //     widget = this.grid[widgetsIndex];
  //     if (!widget.notPlaced) {
  //       rows    = Math.max(rows, widget.$item.y + widget.$item.rows);
  //       columns = Math.max(columns, widget.$item.x + widget.$item.cols);
  //     }
  //   }
  //
  //   if (this.columns !== columns || this.rows !== rows) {
  //     this.columns = columns;
  //     this.rows    = rows;
  //     if (this.options.gridSizeChangedCallback) {
  //       this.options.gridSizeChangedCallback(this);
  //     }
  //   }
  // }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['x'] || changes['y'] ||
      changes['rows'] || changes['cols'] ||
      changes['compactType'] ||
      changes['hasPadding']
    ) {
      this.calculateLayout();
    }
  }

  ngOnInit() {
    const ref        = this._dropContainerRef;
    const clientRect = this.element.nativeElement.getBoundingClientRect();

    ref.currentWidth       = clientRect.width;
    ref.currentHeight      = clientRect.height;
    ref.currentColumnWidth = ref.currentWidth / this.cols;
    ref.currentRowHeight   = ref.currentHeight / this.rows;

    this.calculateLayout$.pipe(
      takeUntil(this._destroyed),
      debounceTime(100),
      tap(() => {
        this._calculateLayout();
      })
    ).subscribe();

  }

  checkCollision(item: TriDragGridItemComponent): any | boolean {
    let collision: any | boolean = false;
    // if (this.options.itemValidateCallback) {
    //   collision = !this.options.itemValidateCallback(item);
    // }
    if (/*!collision && */this.checkGridCollision(item)) {
      collision = true;
    }
    if (!collision) {
      const c = this.findItemWithItem(item);
      if (c) {
        collision = c;
      }
    }
    return collision;
  }

  checkGridCollision(item: any): boolean {
    const noNegativePosition = item.y > -1 && item.x > -1;
    const maxGridCols        = item.cols + item.x <= this.maxCols;
    const maxGridRows        = item.rows + item.y <= this.maxRows;
    const inColsLimits       = item.cols <= item.maxItemCols && item.cols >= item.minItemCols;
    const inRowsLimits       = item.rows <= item.maxItemRows && item.rows >= item.minItemRows;
    const area               = item.cols * item.rows;
    const inMinArea          = item.minItemArea <= area;
    const inMaxArea          = item.maxItemArea >= area;
    return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits && inMinArea && inMaxArea);
  }

  findItemWithItem(item: any): any | boolean {
    for (const widget of this._unsortedItems) {
      if (widget !== item && this.checkCollisionTwoItems(widget, item)) {
        return widget;
      }
    }
    return false;
  }

  checkCollisionTwoItems(item: any, item2: any): boolean {
    const collision = item.x < item2.x + item2.cols
      && item.x + item.cols > item2.x
      && item.y < item2.y + item2.rows
      && item.y + item.rows > item2.y;
    if (!collision) {
      return false;
    }
    return true;
    // if (!this.options.allowMultiLayer) {
    //   return true;
    // }
    // const defaultLayerIndex = this.$options.defaultLayerIndex;
    // const layerIndex        = item.layerIndex === undefined ? defaultLayerIndex : item.layerIndex;
    // const layerIndex2       = item2.layerIndex === undefined ? defaultLayerIndex : item2.layerIndex;
    // return layerIndex === layerIndex2;
  }

  ngOnDestroy() {
    const index = TriDropContainer._dropContainers.indexOf(this);

    if (index > -1) {
      TriDropContainer._dropContainers.splice(index, 1);
    }

    if (this._group) {
      this._group._items.delete(this);
    }

    this._unsortedItems.clear();
    this._dropContainerRef.dispose();
    this._destroyed.next();
    this._destroyed.complete();
  }

  static ngAcceptInputType_disabled: BooleanInput;
  // static ngAcceptInputType_sortingDisabled: BooleanInput;
  static ngAcceptInputType_columns: NumberInput;
  static ngAcceptInputType_rows: NumberInput;
  static ngAcceptInputType_autoScrollDisabled: BooleanInput;
  static ngAcceptInputType_autoScrollStep: NumberInput;
}
