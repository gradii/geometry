import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  Optional,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent, merge, of as observableOf, Subscription } from 'rxjs';
import { auditTime, startWith } from 'rxjs/operators';
import { TabLabelDirective } from './tab-label.directive';
import { TabsInkBarDirective } from './tabs-ink-bar.directive';

const EXAGGERATED_OVERSCROLL = 64;
export type ScrollDirection = 'after' | 'before';

/** duplicated defined https://github.com/angular/angular-cli/issues/2034 **/
export type TabPositionMode = 'horizontal' | 'vertical';

@Component({
  selector     : 'tri-tabs-nav',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div style="float:right;" *ngIf="_tabBarExtraContent">
      <div class="tri-tabs-extra-content">
        <ng-template [ngTemplateOutlet]="_tabBarExtraContent">
        </ng-template>
      </div>
    </div>
    <div class="tri-tabs-nav-container"
         [class.tri-tabs-nav-container-scrolling]="_showPaginationControls"
         #tabListContainer>
      <span class="tri-tabs-tab-prev tri-tabs-tab-arrow-show"
            [class.tri-tabs-tab-btn-disabled]="_disableScrollBefore"
            (click)="_scrollHeader('before')"
            *ngIf="_showPaginationControls">
        <span class="tri-tabs-tab-prev-icon"></span>
      </span>
      <span class="tri-tabs-tab-next tri-tabs-tab-arrow-show"
            [class.tri-tabs-tab-btn-disabled]="_disableScrollAfter"
            (click)="_scrollHeader('after')"
            *ngIf="_showPaginationControls">
        <span class="tri-tabs-tab-next-icon"></span>
      </span>
      <div class="tri-tabs-nav-wrap">
        <div class="tri-tabs-nav-scroll">
          <div class="tri-tabs-nav" [class.tri-tabs-nav-animated]="animated" #tabList
               (cdkObserveContent)="_onContentChanges()">
            <div triTabsInkBar [hidden]="hideBar" [animated]="animated" [positionMode]="positionMode"
                 style="display: block;"></div>
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>`
})
export class TabsNavComponent implements AfterContentChecked, AfterContentInit {
  _showPaginationControls = false;
  _disableScrollAfter = true;
  _disableScrollBefore = true;
  _scrollDistance = 0;
  _selectedIndexChanged = false;
  _realignInkBar: Subscription | null = null;
  _tabLabelCount: number;
  _scrollDistanceChanged: boolean;
  _selectedIndex = 0;
  _tabPositionMode: TabPositionMode = 'horizontal';
  @Input() animated = true;
  @Input() hideBar = false;
  @Input() size = 'default';
  _type = 'line';

  @Input()
  set type(value) {
    this._type = value;
    if (this._type !== 'line') {
      this._inkBar.setDisplay('none');
    } else {
      this._inkBar.setDisplay('block');
    }
  }

  get type() {
    return this._type;
  }

  @ContentChild('tabBarExtraContent') _tabBarExtraContent: TemplateRef<any>;
  @ContentChildren(TabLabelDirective) _labelWrappers: QueryList<TabLabelDirective>;
  @ViewChild(TabsInkBarDirective) _inkBar: TabsInkBarDirective;
  @ViewChild('tabListContainer') _tabListContainer: ElementRef;
  @ViewChild('tabList') _tabList: ElementRef;
  @HostBinding('class.tri-tabs-bar') _tabsBar = true;
  @Input() showPagination = true;

  @Input()
  set positionMode(value: TabPositionMode) {
    this._tabPositionMode = value;
    this._alignInkBarToSelectedTab();
    if (this.showPagination) {
      this._updatePagination();
    }
  }

  get positionMode(): TabPositionMode {
    return this._tabPositionMode;
  }

  @Input()
  get selectedIndex(): number {
    return this._selectedIndex;
  }

  set selectedIndex(value: number) {
    this._selectedIndexChanged = this._selectedIndex !== value;

    this._selectedIndex = value;
  }

  constructor(public _elementRef: ElementRef,
              private _ngZone: NgZone,
              private _renderer: Renderer2,
              @Optional() private _dir: Directionality) {}

  _onContentChanges() {
    if (this.showPagination) {
      this._updatePagination();
    }
    this._alignInkBarToSelectedTab();
  }

  _scrollHeader(scrollDir: ScrollDirection) {
    // Move the scroll distance one-third the length of the tab list's viewport.
    this.scrollDistance += (scrollDir === 'before' ? -1 : 1) * this.viewWidthHeightPix / 3;
  }

  ngAfterContentChecked(): void {
    if (this._tabLabelCount !== this._labelWrappers.length) {
      if (this.showPagination) {
        this._updatePagination();
      }
      this._tabLabelCount = this._labelWrappers.length;
    }
    if (this._selectedIndexChanged) {
      this._scrollToLabel(this._selectedIndex);
      if (this.showPagination) {
        this._checkScrollingControls();
      }
      this._alignInkBarToSelectedTab();
      this._selectedIndexChanged = false;
    }
    if (this._scrollDistanceChanged) {
      if (this.showPagination) {
        this._updateTabScrollPosition();
      }
      this._scrollDistanceChanged = false;
    }
  }

  ngAfterContentInit() {
    this._realignInkBar = this._ngZone.runOutsideAngular(() => {
      const dirChange = this._dir ? this._dir.change : observableOf(null);
      const resize =
              typeof window !== 'undefined' ? fromEvent(window, 'resize').pipe(auditTime(10)) : observableOf(null);

      return merge(dirChange, resize).pipe(startWith(null)).subscribe(() => {
        if (this.showPagination) {
          this._updatePagination();
        }
        this._alignInkBarToSelectedTab();
      });
    });
  }

  _updateTabScrollPosition() {
    const scrollDistance = this.scrollDistance;
    if (this.positionMode === 'horizontal') {
      const translateX = this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;
      this._renderer.setStyle(this._tabList.nativeElement, 'transform', `translate3d(${translateX}px, 0, 0)`);
    } else {
      this._renderer.setStyle(this._tabList.nativeElement, 'transform', `translate3d(0,${-scrollDistance}px, 0)`);
    }
  }

  _updatePagination() {
    this._checkPaginationEnabled();
    this._checkScrollingControls();
    this._updateTabScrollPosition();
  }

  _checkPaginationEnabled() {
    this._showPaginationControls = this.tabListScrollWidthHeightPix > this.elementRefOffSetWidthHeight;

    if (!this._showPaginationControls) {
      this.scrollDistance = 0;
    }
  }

  _scrollToLabel(labelIndex: number) {
    const selectedLabel = this._labelWrappers ? this._labelWrappers.toArray()[labelIndex] : null;

    if (!selectedLabel) {
      return;
    }

    // The view length is the visible width of the tab labels.

    let labelBeforePos: number, labelAfterPos: number;
    if (this.positionMode === 'horizontal') {
      if (this._getLayoutDirection() === 'ltr') {
        labelBeforePos = selectedLabel.getOffsetLeft();
        labelAfterPos = labelBeforePos + selectedLabel.getOffsetWidth();
      } else {
        labelAfterPos = this._tabList.nativeElement.offsetWidth - selectedLabel.getOffsetLeft();
        labelBeforePos = labelAfterPos - selectedLabel.getOffsetWidth();
      }
    } else {
      labelBeforePos = selectedLabel.getOffsetTop();
      labelAfterPos = labelBeforePos + selectedLabel.getOffsetHeight();
    }
    const beforeVisiblePos = this.scrollDistance;
    const afterVisiblePos = this.scrollDistance + this.viewWidthHeightPix;

    if (labelBeforePos < beforeVisiblePos) {
      // Scroll header to move label to the before direction
      this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
    } else if (labelAfterPos > afterVisiblePos) {
      // Scroll header to move label to the after direction
      this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
    }
  }

  _checkScrollingControls() {
    // Check if the pagination arrows should be activated.
    this._disableScrollBefore = this.scrollDistance === 0;
    this._disableScrollAfter = this.scrollDistance === this._getMaxScrollDistance();
  }

  /**
   * Determines what is the maximum length in pixels that can be set for the scroll distance. This
   * is equal to the difference in width between the tab list container and tab header container.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _getMaxScrollDistance(): number {
    return this.tabListScrollWidthHeightPix - this.viewWidthHeightPix || 0;
  }

  /** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
  set scrollDistance(v: number) {
    this._scrollDistance = Math.max(0, Math.min(this._getMaxScrollDistance(), v));

    // Mark that the scroll distance has changed so that after the view is checked, the CSS
    // transformation can move the header.
    this._scrollDistanceChanged = true;

    this._checkScrollingControls();
  }

  get scrollDistance(): number {
    return this._scrollDistance;
  }

  get viewWidthHeightPix() {
    let PAGINATION_PIX = 0;
    if (this._showPaginationControls) {
      PAGINATION_PIX = 64;
    }
    if (this.positionMode === 'horizontal') {
      return this._tabListContainer.nativeElement.offsetWidth - PAGINATION_PIX;
    } else {
      return this._tabListContainer.nativeElement.offsetHeight - PAGINATION_PIX;
    }
  }

  get tabListScrollWidthHeightPix() {
    if (this.positionMode === 'horizontal') {
      return this._tabList.nativeElement.scrollWidth;
    } else {
      return this._tabList.nativeElement.scrollHeight;
    }
  }

  get elementRefOffSetWidthHeight() {
    if (this.positionMode === 'horizontal') {
      return this._elementRef.nativeElement.offsetWidth;
    } else {
      return this._elementRef.nativeElement.offsetHeight;
    }
  }

  _getLayoutDirection(): Direction {
    return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
  }

  _alignInkBarToSelectedTab(): void {
    if (this.type === 'line') {
      const selectedLabelWrapper =
              this._labelWrappers && this._labelWrappers.length
                ? this._labelWrappers.toArray()[this.selectedIndex].elementRef.nativeElement
                : null;
      if (this._inkBar) {
        this._inkBar.alignToElement(selectedLabelWrapper);
      }
    }
  }
}
