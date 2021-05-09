/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import {FocusableOption, FocusMonitor, FocusOrigin} from '@angular/cdk/a11y';
import {BooleanInput} from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  Inject,
  Optional,
  Input,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import {
  CanDisable, CanDisableCtor,
  CanDisableRipple, CanDisableRippleCtor,
  mixinDisabled,
  mixinDisableRipple,
} from '@gradii/triangle/core';
import {Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {TRI_CONTEXT_MENU_PANEL, TriContextMenuPanel} from './context-menu-panel';

// Boilerplate for applying mixins to TriContextMenuItem.
/** @docs-private */
class TriContextMenuItemBase {}
const _TriContextMenuItemMixinBase: CanDisableRippleCtor & CanDisableCtor & typeof TriContextMenuItemBase =
    mixinDisableRipple(mixinDisabled(TriContextMenuItemBase));

/**
 * Single item inside of a `tri-context-menu`. Provides the menu item styling and accessibility treatment.
 */
@Component({
  selector: '[tri-context-menu-item]',
  exportAs: 'triContextMenuItem',
  inputs: ['disabled', 'disableRipple'],
  host: {
    '[attr.role]': 'role',
    '[class.tri-context-menu-item]': 'true',
    '[class.tri-context-menu-item-highlighted]': '_highlighted',
    '[class.tri-context-menu-item-submenu-trigger]': '_triggersSubmenu',
    '[attr.tabindex]': '_getTabIndex()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.disabled]': 'disabled || null',
    'class': 'mat-focus-indicator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'context-menu-item.html',
})
export class TriContextMenuItem extends _TriContextMenuItemMixinBase
    implements FocusableOption, CanDisable, CanDisableRipple, AfterViewInit, OnDestroy {

  /** ARIA role for the menu item. */
  @Input() role: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox' = 'menuitem';

  /** Stream that emits when the menu item is hovered. */
  readonly _hovered: Subject<TriContextMenuItem> = new Subject<TriContextMenuItem>();

  /** Stream that emits when the menu item is focused. */
  readonly _focused = new Subject<TriContextMenuItem>();

  /** Whether the menu item is highlighted. */
  _highlighted: boolean = false;

  /** Whether the menu item acts as a trigger for a sub-menu. */
  _triggersSubmenu: boolean = false;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    /**
     * @deprecated `_document` parameter is no longer being used and will be removed.
     * @breaking-change 12.0.0
     */
    @Inject(DOCUMENT) _document?: any,
    private _focusMonitor?: FocusMonitor,
    @Inject(TRI_CONTEXT_MENU_PANEL) @Optional() public _parentMenu?: TriContextMenuPanel<TriContextMenuItem>) {

    // @breaking-change 8.0.0 make `_focusMonitor` and `document` required params.
    super();

    if (_parentMenu && _parentMenu.addItem) {
      _parentMenu.addItem(this);
    }
  }

  /** Focuses the menu item. */
  focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (this._focusMonitor && origin) {
      this._focusMonitor.focusVia(this._getHostElement(), origin, options);
    } else {
      this._getHostElement().focus(options);
    }

    this._focused.next(this);
  }

  ngAfterViewInit() {
    if (this._focusMonitor) {
      // Start monitoring the element so it gets the appropriate focused classes. We want
      // to show the focus style for menu items only when the focus was not caused by a
      // mouse or touch interaction.
      this._focusMonitor.monitor(this._elementRef, false);
    }
  }

  ngOnDestroy() {
    if (this._focusMonitor) {
      this._focusMonitor.stopMonitoring(this._elementRef);
    }

    if (this._parentMenu && this._parentMenu.removeItem) {
      this._parentMenu.removeItem(this);
    }

    this._hovered.complete();
    this._focused.complete();
  }

  /** Used to set the `tabindex`. */
  _getTabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  /** Returns the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /** Prevents the default element actions if it is disabled. */
  // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
  // In Ivy the `host` bindings will be merged when this class is extended, whereas in
  // ViewEngine they're overwritten.
  // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
  // tslint:disable-next-line:no-host-decorator-in-concrete
  @HostListener('click', ['$event'])
  _checkDisabled(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /** Emits to the hover stream. */
  // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
  // In Ivy the `host` bindings will be merged when this class is extended, whereas in
  // ViewEngine they're overwritten.
  // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
  // tslint:disable-next-line:no-host-decorator-in-concrete
  @HostListener('mouseenter')
  _handleMouseEnter() {
    this._hovered.next(this);
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    const clone = this._elementRef.nativeElement.cloneNode(true) as HTMLElement;
    const icons = clone.querySelectorAll('mat-icon, .material-icons');

    // Strip away icons so they don't show up in the text.
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i];
      icon.parentNode?.removeChild(icon);
    }

    return clone.textContent?.trim() || '';
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_disableRipple: BooleanInput;
}
