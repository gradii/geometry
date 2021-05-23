/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  AfterViewInit, ComponentRef, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NbDynamicOverlay } from '../cdk/overlay/dynamic/dynamic-overlay';
import { NbDynamicOverlayHandler } from '../cdk/overlay/dynamic/dynamic-overlay-handler';
import { NbOverlayConfig, NbOverlayRef } from '../cdk/overlay/mapping';
import {
  NbAdjustableConnectedPositionStrategy, NbAdjustment, NbPosition
} from '../cdk/overlay/overlay-position';
import { NbTrigger, NbTriggerValues } from '../cdk/overlay/overlay-trigger';
import { NbMenuItem, NbMenuService } from '../menu/menu.service';
import { NbContextMenuComponent } from './context-menu.component';

export interface TriContextMenuContext {
  items: NbMenuItem[];
  tag: string;
  position: NbPosition;
}

@Directive({
  selector : '[triContextMenu]',
  providers: [NbDynamicOverlayHandler, NbDynamicOverlay],
  host     : {
    'class': 'context-menu-host'
  }
})
export class ContextMenuDirective implements OnChanges, AfterViewInit, OnDestroy, OnInit {
  /**
   * Position will be calculated relatively host element based on the position.
   * Can be top, right, bottom and left.
   */
  @Input('nbContextMenuPlacement')
  get position(): NbPosition {
    return this._position;
  }

  set position(value: NbPosition) {
    if (value !== this.position) {
      this._position = value;
      this.updateOverlayContext();
    }
  }

  _position: NbPosition = NbPosition.BOTTOM;

  /**
   * Container position will be changes automatically based on this strategy if container can't fit view port.
   * Set this property to any falsy value if you want to disable automatically adjustment.
   * Available values: clockwise, counterclockwise.
   */
  @Input('nbContextMenuAdjustment')
  adjustment: NbAdjustment = NbAdjustment.CLOCKWISE;

  /**
   * Set NbMenu tag, which helps identify menu when working with NbMenuService.
   */
  @Input('nbContextMenuTag')
  get tag(): string {
    return this._tag;
  }

  set tag(value: string) {
    if (value !== this.tag) {
      this._tag = value;
      this.updateOverlayContext();
    }
  }

  _tag: string;

  /**
   * Basic menu items, will be passed to the internal NbMenuComponent.
   */
  @Input('triContextMenu')
  get items(): NbMenuItem[] {
    return this._items;
  }

  set items(items: NbMenuItem[]) {
    this.validateItems(items);
    this._items = items;
    this.updateOverlayContext();
  }

  /**
   * Describes when the container will be shown.
   * Available options: `click`, `hover`, `hint`, `focus` and `noop`
   */
  @Input('nbContextMenuTrigger')
  trigger: NbTrigger = NbTrigger.CLICK;
  static ngAcceptInputType_trigger: NbTriggerValues;

  @Input('nbContextMenuClass')
  get contextMenuClass(): string {
    return this._contextMenuClass;
  }

  set contextMenuClass(value: string) {
    if (value !== this.contextMenuClass) {
      this._contextMenuClass = value;
      this.overlayConfig     = {panelClass: this.contextMenuClass};
    }
  }

  _contextMenuClass: string = '';

  protected ref: NbOverlayRef;
  protected container: ComponentRef<any>;
  protected positionStrategy: NbAdjustableConnectedPositionStrategy;
  protected overlayConfig: NbOverlayConfig       = {panelClass: this.contextMenuClass};
  protected overlayContext: NbContextMenuContext = {
    items   : this.items,
    tag     : this.tag,
    position: this.position
  };
  protected destroy$                             = new Subject<void>();
  private _items: NbMenuItem[]                   = [];

  private dynamicOverlay: NbDynamicOverlay;

  constructor(private hostRef: ElementRef,
              private menuService: NbMenuService,
              private cdkOverlayOrigin: CdkOverlayOrigin) {
  }

  ngOnInit() {
    this.cdkOverlayOrigin
      .host(this.hostRef)
      .componentType(NbContextMenuComponent);
  }

  ngOnChanges() {
    this.rebuild();
  }

  ngAfterViewInit() {
    this.dynamicOverlay = this.configureDynamicOverlay()
      .build();
    this.subscribeOnItemClick();
  }

  rebuild() {
    this.dynamicOverlay = this.configureDynamicOverlay()
      .rebuild();
  }

  show() {
    this.dynamicOverlay.show();
  }

  hide() {
    this.dynamicOverlay.hide();
  }

  toggle() {
    this.dynamicOverlay.toggle();
  }

  ngOnDestroy() {
    this.dynamicOverlayHandler.destroy();
  }

  protected configureDynamicOverlay() {
    return this.dynamicOverlayHandler
      .position(this.position)
      .trigger(this.trigger)
      .adjustment(this.adjustment)
      .context(this.overlayContext)
      .overlayConfig(this.overlayConfig);
  }

  /*
   * NbMenuComponent will crash if don't pass menu items to it.
   * So, we just validating them and throw custom obvious error.
   */
  private validateItems(items: NbMenuItem[]) {
    if (!items || !items.length) {
      throw Error(`List of menu items expected, but given: ${items}`);
    }
  }

  private subscribeOnItemClick() {
    this.menuService.onItemClick()
      .pipe(
        filter(({tag}) => tag === this.tag),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.hide());
  }

  protected updateOverlayContext() {
    this.overlayContext = {items: this.items, position: this.position, tag: this.tag};
  }
}
