import {BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';
import {ScrollDispatcher} from '@angular/cdk/scrolling';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    forwardRef,
    Inject,
    Input,
    NgZone,
    QueryList,
    ViewEncapsulation,
} from '@angular/core';
import {
    TRI_DRAWER_CONTAINER,
    TriDrawer,
    triDrawerAnimations,
    TriDrawerContainer,
    TriDrawerContent
} from '@gradii/triangle/drawer';


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
export class TriSidenavContent extends TriDrawerContent {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => TriSidenavContainer)) container: TriSidenavContainer,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone) {
    super(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone);
  }
}


@Component({
  selector       : 'tri-sidenav',
  exportAs       : 'triSidenav',
  templateUrl    : 'sidenav.html',
  animations     : [triDrawerAnimations.transformDrawer],
  host           : {
    'class'                    : 'tri-drawer tri-sidenav',
    'tabIndex'                 : '-1',
    // must prevent the browser from aligning text based on value
    '[attr.align]'             : 'null',
    '[class.tri-drawer-end]'   : 'position === "end"',
    '[class.tri-drawer-over]'  : 'mode === "over"',
    '[class.tri-drawer-push]'  : 'mode === "push"',
    '[class.tri-drawer-side]'  : 'mode === "side"',
    '[class.tri-drawer-opened]': 'opened',
    '[class.tri-sidenav-fixed]': 'fixedInViewport',
    '[style.top.px]'           : 'fixedInViewport ? fixedTopGap : null',
    '[style.bottom.px]'        : 'fixedInViewport ? fixedBottomGap : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation  : ViewEncapsulation.None,
})
export class TriSidenav extends TriDrawer {
  static ngAcceptInputType_fixedInViewport: BooleanInput;
  static ngAcceptInputType_fixedTopGap: NumberInput;
  static ngAcceptInputType_fixedBottomGap: NumberInput;

  private _fixedInViewport = false;

  /** Whether the sidenav is fixed in the viewport. */
  @Input()
  get fixedInViewport(): boolean {
    return this._fixedInViewport;
  }

  set fixedInViewport(value) {
    this._fixedInViewport = coerceBooleanProperty(value);
  }

  private _fixedTopGap = 0;

  /**
   * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
   * mode.
   */
  @Input()
  get fixedTopGap(): number {
    return this._fixedTopGap;
  }

  set fixedTopGap(value) {
    this._fixedTopGap = coerceNumberProperty(value);
  }

  private _fixedBottomGap = 0;

  /**
   * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
   * fixed mode.
   */
  @Input()
  get fixedBottomGap(): number {
    return this._fixedBottomGap;
  }

  set fixedBottomGap(value) {
    this._fixedBottomGap = coerceNumberProperty(value);
  }
}


@Component({
  selector       : 'tri-sidenav-container',
  exportAs       : 'triSidenavContainer',
  templateUrl    : 'sidenav-container.html',
  styleUrls      : ['../style/sidenav.css'],
  host           : {
    'class'                                         : 'tri-drawer-container tri-sidenav-container',
    '[class.tri-drawer-container-explicit-backdrop]': '_backdropOverride',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation  : ViewEncapsulation.None,
  providers      : [{
    provide    : TRI_DRAWER_CONTAINER,
    useExisting: TriSidenavContainer
  }]

})
export class TriSidenavContainer extends TriDrawerContainer {
  static ngAcceptInputType_hasBackdrop: BooleanInput;
  @ContentChildren(TriSidenav, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true
  })
  _allDrawers: QueryList<TriSidenav>;
  @ContentChild(TriSidenavContent) _content: TriSidenavContent;
}
