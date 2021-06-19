/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { Directionality } from '@angular/cdk/bidi';
import {
  BooleanInput, coerceArray, coerceBooleanProperty, coerceNumberProperty, NumberInput,
} from '@angular/cdk/coercion';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, OnDestroy,
  Optional, Output, SkipSelf,
} from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { DragDrop } from '../drag-drop';
import { TriDragDrop, TriDragEnter, TriDragExit, TriDragSortEvent } from '../event/drag-events';
import { DragRef } from '../drag-ref';
import { DropContainerRef } from '../drop-container-ref';
import { assertElementNode } from './assertions';
import { TRI_DRAG_CONFIG, DragAxis, DragDropConfig, DropContainerOrientation } from './config';
import { TriDrag } from './drag';
import { TRI_DROP_CONTAINER_GROUP, TriDropContainerGroup } from './drop-container-group';

/** Counter used to generate unique ids for drop zones. */
let _uniqueIdCounter = 0;

/**
 * Internal compile-time-only representation of a `TriDropContainer`.
 * Used to avoid circular import issues between the `TriDropContainer` and the `TriDrag`.
 * @docs-private
 */
export interface TriDropContainerInternal extends TriDropContainer {
}

/**
 * Injection token that can be used to reference instances of `TriDropContainer`. It serves as
 * alternative token to the actual `TriDropContainer` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const TRI_DROP_CONTAINER = new InjectionToken<TriDropContainer>('TriDropContainer');

/** Container that wraps a set of draggable items. */
@Directive({
  selector : '[triDropContainer], tri-drop-container',
  exportAs : 'triDropContainer',
  providers: [
    // Prevent child drop lists from picking up the same group as their parent.
    {provide: TRI_DROP_CONTAINER_GROUP, useValue: undefined},
    {provide: TRI_DROP_CONTAINER, useExisting: TriDropContainer},
  ],
  host     : {
    'class'                               : 'tri-drop-container',
    '[attr.id]'                           : 'id',
    '[class.tri-drop-container-disabled]' : 'disabled',
    '[class.tri-drop-container-dragging]' : '_dropContainerRef.isDragging()',
    '[class.tri-drop-container-receiving]': '_dropContainerRef.isReceiving()',
  }
})
export class TriDropContainer<T = any> implements OnDestroy {
  /** Emits when the list has been destroyed. */
  private readonly _destroyed = new Subject<void>();

  /** Whether the element's scrollable parents have been resolved. */
  private _scrollableParentsResolved: boolean;

  /** Keeps track of the drop lists that are currently on the page. */
  private static _dropContainers: TriDropContainer[] = [];

  /** Reference to the underlying drop list instance. */
  _dropContainerRef: DropContainerRef<TriDropContainer<T>>;

  /**
   * Other draggable containers that this container is connected to and into which the
   * container's items can be transferred. Can either be references to other drop containers,
   * or their unique IDs.
   */
  @Input('triDropContainerConnectedTo')
  connectedTo: (TriDropContainer | string)[] | TriDropContainer | string = [];

  /** Arbitrary data to attach to this container. */
  @Input('triDropContainerData') data: T;

  /** Direction in which the list is oriented. */
  @Input('triDropContainerOrientation') orientation: DropContainerOrientation;

  /**
   * Unique ID for the drop zone. Can be used as a reference
   * in the `connectedTo` of another `TriDropContainer`.
   */
  @Input() id: string = `tri-drop-container-${_uniqueIdCounter++}`;

  /** Locks the position of the draggable elements inside the container along the specified axis. */
  @Input('triDropContainerLockAxis') lockAxis: DragAxis;

  /** Whether starting a dragging sequence from this container is disabled. */
  @Input('triDropContainerDisabled')
  get disabled(): boolean {
    return this._disabled || (!!this._group && this._group.disabled);
  }

  set disabled(value: boolean) {
    // Usually we sync the directive and ref state right before dragging starts, in order to have
    // a single point of failure and to avoid having to use setters for everything. `disabled` is
    // a special case, because it can prevent the `beforeStarted` event from firing, which can lock
    // the user in a disabled state, so we also need to sync it as it's being set.
    this._dropContainerRef.disabled = this._disabled = coerceBooleanProperty(value);
  }

  private _disabled: boolean;

  /** Whether sorting within this drop list is disabled. */
  @Input('triDropContainerSortingDisabled')
  sortingDisabled: boolean;

  /**
   * Function that is used to determine whether an item
   * is allowed to be moved into a drop container.
   */
  @Input('triDropContainerEnterPredicate')
  enterPredicate: (drag: TriDrag, drop: TriDropContainer) => boolean = () => true;

  /** Functions that is used to determine whether an item can be sorted into a particular index. */
  @Input('triDropContainerSortPredicate')
  sortPredicate: (index: number, drag: TriDrag, drop: TriDropContainer) => boolean = () => true;

  /** Whether to auto-scroll the view when the user moves their pointer close to the edges. */
  @Input('triDropContainerAutoScrollDisabled')
  autoScrollDisabled: boolean;

  /** Number of pixels to scroll for each frame when auto-scrolling an element. */
  @Input('triDropContainerAutoScrollStep')
  autoScrollStep: number;

  /** Emits when the user drops an item inside the container. */
  @Output('triDropContainerDropped')
  readonly dropped: EventEmitter<TriDragDrop<T, any>> = new EventEmitter<TriDragDrop<T, any>>();

  /**
   * Emits when the user has moved a new drag item into this container.
   */
  @Output('triDropContainerEntered')
  readonly entered: EventEmitter<TriDragEnter<T>> = new EventEmitter<TriDragEnter<T>>();

  /**
   * Emits when the user removes an item from the container
   * by dragging it into another container.
   */
  @Output('triDropContainerExited')
  readonly exited: EventEmitter<TriDragExit<T>> = new EventEmitter<TriDragExit<T>>();

  /** Emits as the user is swapping items while actively dragging. */
  @Output('triDropContainerSorted')
  readonly sorted: EventEmitter<TriDragSortEvent<T>> = new EventEmitter<TriDragSortEvent<T>>();

  /**
   * Keeps track of the items that are registered with this container. Historically we used to
   * do this with a `ContentChildren` query, however queries don't handle transplanted views very
   * well which means that we can't handle cases like dragging the headers of a `mat-table`
   * correctly. What we do instead is to have the items register themselves with the container
   * and then we sort them based on their position in the DOM.
   */
  private _unsortedItems = new Set<TriDrag>();

  constructor(
    /** Element that the drop list is attached to. */
    public element: ElementRef<HTMLElement>, dragDrop: DragDrop,
    private _changeDetectorRef: ChangeDetectorRef,
    private _scrollDispatcher: ScrollDispatcher,
    @Optional() private _dir?: Directionality,
    @Optional() @Inject(TRI_DROP_CONTAINER_GROUP) @SkipSelf()
    private _group?: TriDropContainerGroup<TriDropContainer>,
    @Optional() @Inject(TRI_DRAG_CONFIG) config?: DragDropConfig) {

    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      assertElementNode(element.nativeElement, 'triDropContainer');
    }

    this._dropContainerRef      = dragDrop.createDropContainer(element);
    this._dropContainerRef.data = this;

    if (config) {
      this._assignDefaults(config);
    }

    this._dropContainerRef.enterPredicate = (drag: DragRef<TriDrag>,
                                             drop: DropContainerRef<TriDropContainer>) => {
      return this.enterPredicate(drag.data, drop.data);
    };

    this._dropContainerRef.sortPredicate =
      (index: number, drag: DragRef<TriDrag>, drop: DropContainerRef<TriDropContainer>) => {
        return this.sortPredicate(index, drag.data, drop.data);
      };

    this._setupInputSyncSubscription(this._dropContainerRef);
    this._handleEvents(this._dropContainerRef);
    TriDropContainer._dropContainers.push(this);

    if (_group) {
      _group._items.add(this);
    }
  }

  /** Registers an items with the drop list. */
  addItem(item: TriDrag): void {
    this._unsortedItems.add(item);

    if (this._dropContainerRef.isDragging()) {
      this._syncItemsWithRef();
    }
  }

  /** Removes an item from the drop list. */
  removeItem(item: TriDrag): void {
    this._unsortedItems.delete(item);

    if (this._dropContainerRef.isDragging()) {
      this._syncItemsWithRef();
    }
  }

  /** Gets the registered items in the list, sorted by their position in the DOM. */
  getSortedItems(): TriDrag[] {
    return Array.from(this._unsortedItems).sort((a: TriDrag, b: TriDrag) => {
      const documentPosition =
              a._dragRef.getVisibleElement().compareDocumentPosition(
                b._dragRef.getVisibleElement());

      // `compareDocumentPosition` returns a bitmask so we have to use a bitwise operator.
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
      // tslint:disable-next-line:no-bitwise
      return documentPosition & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
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

  /** Syncs the inputs of the TriDropContainer with the options of the underlying DropContainerRef. */
  private _setupInputSyncSubscription(ref: DropContainerRef<TriDropContainer>) {
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
      ref.sortingDisabled    = coerceBooleanProperty(this.sortingDisabled);
      ref.autoScrollDisabled = coerceBooleanProperty(this.autoScrollDisabled);
      ref.autoScrollStep     = coerceNumberProperty(this.autoScrollStep, 2);
      ref
        .connectedTo(
          siblings.filter(drop => drop && drop !== this).map(list => list._dropContainerRef))
        .withOrientation(this.orientation);
    });
  }

  /** Handles events from the underlying DropContainerRef. */
  private _handleEvents(ref: DropContainerRef<TriDropContainer>) {
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

    ref.sorted.subscribe(event => {
      this.sorted.emit({
        previousIndex: event.previousIndex,
        currentIndex : event.currentIndex,
        container    : this,
        item         : event.item.data
      });
    });

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
            lockAxis, draggingDisabled, sortingDisabled, listAutoScrollDisabled, listOrientation
          } = config;

    this.disabled           = draggingDisabled == null ? false : draggingDisabled;
    this.sortingDisabled    = sortingDisabled == null ? false : sortingDisabled;
    this.autoScrollDisabled = listAutoScrollDisabled == null ? false : listAutoScrollDisabled;
    this.orientation        = listOrientation || 'vertical';

    if (lockAxis) {
      this.lockAxis = lockAxis;
    }
  }

  /** Syncs up the registered drag items with underlying drop list ref. */
  private _syncItemsWithRef() {
    this._dropContainerRef.withItems(this.getSortedItems().map(item => item._dragRef));
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_sortingDisabled: BooleanInput;
  static ngAcceptInputType_autoScrollDisabled: BooleanInput;
  static ngAcceptInputType_autoScrollStep: NumberInput;
}
