/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, NgZone,
  ViewEncapsulation,
} from '@angular/core';
import { TriDrawerContent } from '@gradii/triangle/drawer';
import { SidenavContainerComponent } from './sidenav-container.component';


@Component({
  selector       : 'tri-sidenav-content',
  template       : '<ng-content></ng-content>',
  host           : {
    'class'                  : 'tri-drawer-content tri-sidenav-content',
    '[style.margin-left.px]' : '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation  : ViewEncapsulation.None,
})
export class SidenavContentComponent extends TriDrawerContent {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => SidenavContainerComponent)) container: SidenavContainerComponent,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
  ) {
    super(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone);
  }
}
