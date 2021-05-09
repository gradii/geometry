/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import {EventEmitter, TemplateRef, InjectionToken} from '@angular/core';
import {MenuPositionX, MenuPositionY} from './context-menu-positions';
import {Direction} from '@angular/cdk/bidi';
import {FocusOrigin} from '@angular/cdk/a11y';
import {TriContextMenuContent} from './context-menu-content';

/**
 * Injection token used to provide the parent menu to menu-specific components.
 * @docs-private
 */
export const TRI_CONTEXT_MENU_PANEL = new InjectionToken<TriContextMenuPanel>('TRI_CONTEXT_MENU_PANEL');

/**
 * Interface for a custom menu panel that can be used with `triContextMenuTriggerFor`.
 * @docs-private
 */
export interface TriContextMenuPanel<T = any> {
  xPosition: MenuPositionX;
  yPosition: MenuPositionY;
  overlapTrigger: boolean;
  templateRef: TemplateRef<any>;
  close: EventEmitter<void | 'click' | 'keydown' | 'tab'>;
  parentMenu?: TriContextMenuPanel | undefined;
  direction?: Direction;
  focusFirstItem: (origin?: FocusOrigin) => void;
  resetActiveItem: () => void;
  setPositionClasses?: (x: MenuPositionX, y: MenuPositionY) => void;
  setElevation?(depth: number): void;
  lazyContent?: TriContextMenuContent;
  backdropClass?: string;
  overlayPanelClass?: string|string[];
  hasBackdrop?: boolean;
  readonly panelId?: string;

  /**
   * @deprecated To be removed.
   * @breaking-change 8.0.0
   */
  addItem?: (item: T) => void;

  /**
   * @deprecated To be removed.
   * @breaking-change 8.0.0
   */
  removeItem?: (item: T) => void;
}
