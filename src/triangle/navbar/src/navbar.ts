/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, Directive, ElementRef, Inject,
  QueryList, ViewEncapsulation,
} from '@angular/core';
import { CanColor, mixinColor } from '@gradii/triangle/core';


// Boilerplate for applying mixins to TriNavbar.
/** @docs-private */
const _TriNavbarBase = mixinColor(class {
  constructor(public _elementRef: ElementRef) {
  }
});

@Directive({
  selector: 'tri-navbar-row',
  exportAs: 'triToolbarRow',
  host    : {'class': 'tri-navbar-row'},
})
export class TriNavbarRow {
}

@Component({
  selector       : 'tri-navbar',
  exportAs       : 'triToolbar',
  templateUrl    : 'navbar.html',
  styleUrls      : ['../style/navbar.css'],
  inputs         : ['color'],
  host           : {
    'class'                            : 'tri-navbar',
    '[class.tri-navbar-multiple-rows]': '_navbarRows.length > 0',
    '[class.tri-navbar-single-row]'   : '_navbarRows.length === 0',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation  : ViewEncapsulation.None,
})
export class TriNavbar extends _TriNavbarBase implements CanColor, AfterViewInit {
  private _document: Document;

  /** Reference to all navbar row elements that have been projected. */
  @ContentChildren(TriNavbarRow, {descendants: true}) _navbarRows: QueryList<TriNavbarRow>;

  constructor(
    elementRef: ElementRef,
    private _platform: Platform,
    @Inject(DOCUMENT) document?: any) {
    super(elementRef);

    this._document = document;
  }

  ngAfterViewInit() {
    if (this._platform.isBrowser) {
      this._checkToolbarMixedModes();
      this._navbarRows.changes.subscribe(() => this._checkToolbarMixedModes());
    }
  }

  /**
   * Throws an exception when developers are attempting to combine the different navbar row modes.
   */
  private _checkToolbarMixedModes() {
    if (this._navbarRows.length && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      // Check if there are any other DOM nodes that can display content but aren't inside of
      // a <tri-navbar-row> element.
      const isCombinedUsage = Array.from<HTMLElement>(this._elementRef.nativeElement.childNodes)
        .filter(node => !(node.classList && node.classList.contains('tri-navbar-row')))
        .filter(node => node.nodeType !== (this._document ? this._document.COMMENT_NODE : 8))
        .some(node => !!(node.textContent && node.textContent.trim()));

      if (isCombinedUsage) {
        throwToolbarMixedModesError();
      }
    }
  }
}

/**
 * Throws an exception when attempting to combine the different navbar row modes.
 * @docs-private
 */
export function throwToolbarMixedModesError() {
  throw Error('TriNavbar: Attempting to combine different navbar modes. ' +
    'Either specify multiple `<tri-navbar-row>` elements explicitly or just place content ' +
    'inside of a `<tri-navbar>` for a single row.');
}
