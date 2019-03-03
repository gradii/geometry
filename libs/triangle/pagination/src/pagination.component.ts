import { PageChangeEvent } from '@gradii/triangle/data-table';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

const isChanged = (propertyName: string, changes: any, skipFirstChange: boolean = true) =>
  changes[propertyName] &&
  (!changes[propertyName].isFirstChange() || !skipFirstChange) &&
  changes[propertyName].previousValue !== changes[propertyName].currentValue;
const anyChanged = (propertyNames: string[], changes: any, skipFirstChange: boolean = true) =>
  propertyNames.some(name => isChanged(name, changes, skipFirstChange));

@Component({
  selector     : 'tri-pagination',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ul class="ant-pagination ant-pagination-simple" *ngIf="simple">
      <li
        title="上一页"
        class="ant-pagination-prev"
        (click)="_jumpPage(pageIndex-1)"
        [class.tri-pagination-disabled]="_isFirstIndex">
        <a></a>
      </li>
      <li [attr.title]="pageIndex+'/'+_lastIndex" class="ant-pagination-simple-pager">
        <input [ngModel]="pageIndex" (ngModelChange)="_pageIndexChange($event)" size="3"><span
        class="ant-pagination-slash">／</span>{{_lastIndex}}
      </li>
      <li
        title="下一页"
        class="ant-pagination-next"
        (click)="_jumpPage(pageIndex+1)"
        [class.tri-pagination-disabled]="_isLastIndex">
        <a></a>
      </li>
    </ul>
    <ul *ngIf="!simple" class="ant-pagination" [class.mini]="size=='small'">
      <span class="ant-pagination-total-text" *ngIf="showTotal">共 {{_total}} 条</span>
      <li
        title="上一页"
        class="ant-pagination-prev"
        (click)="_jumpPage(pageIndex-1)"
        [class.tri-pagination-disabled]="_isFirstIndex">
        <a></a>
      </li>
      <li
        title="第一页"
        class="ant-pagination-item"
        (click)="_jumpPage(_firstIndex)"
        [class.tri-pagination-item-active]="_isFirstIndex">
        <a>{{_firstIndex}}</a>
      </li>
      <li
        [attr.title]="'向前 '+_roundPageSize+' 页'"
        (click)="_jumpBefore(limit)"
        class="ant-pagination-jump-prev"
        *ngIf="(_lastIndex >9)&&(pageIndex-3>_firstIndex)">
        <a></a>
      </li>
      <li
        *ngFor="let page of _pages"
        [attr.title]="page.index"
        class="ant-pagination-item"
        (click)="_jumpPage(page.index)"
        [class.tri-pagination-item-active]="pageIndex==page.index">
        <a>{{page.index}}</a>
      </li>
      <li
        [attr.title]="'向后 '+_roundPageSize+' 页'"
        (click)="_jumpAfter(limit)"
        class="ant-pagination-jump-next"
        *ngIf="(_lastIndex >9)&&(pageIndex+3<_lastIndex)">
        <a></a>
      </li>
      <li
        [attr.title]="'最后一页: '+_lastIndex"
        class="ant-pagination-item"
        (click)="_jumpPage(_lastIndex)"
        *ngIf="(_lastIndex>0)&&(_lastIndex!==_firstIndex)"
        [class.tri-pagination-item-active]="_isLastIndex">
        <a>{{_lastIndex}}</a>
      </li>
      <li
        title="下一页"
        class="ant-pagination-next"
        (click)="_jumpPage(pageIndex+1)"
        [class.tri-pagination-disabled]="_isLastIndex">
        <a></a>
      </li>
      <div class="ant-pagination-options">
        <tri-select
          *ngIf="showSizeChanger"
          [size]="size=='small'?'small':''"
          class="ant-pagination-options-size-changer"
          [ngModel]="limit"
          (ngModelChange)="_pageSizeChange($event)">
          <tri-option
            *ngFor="let option of _options"
            [label]="option+ '条/页'"
            [value]="option">
          </tri-option>
          <tri-option
            *ngIf="_options.indexOf(_limit)==-1"
            [label]="_limit + '条/页'"
            [value]="_limit">
          </tri-option>
        </tri-select>
        <div class="ant-pagination-options-quick-jumper"
             *ngIf="showQuickJumper">
          跳至<input [ngModel]="pageIndex" (ngModelChange)="_pageIndexChange($event)">页
        </div>
      </div>
    </ul>`
})
export class PaginationComponent implements OnChanges {
  _el: HTMLElement;
  // cache pageIndex
  _current = 1;
  _total: number;
  // _pageSize        = 10;
  _firstIndex = 1;
  _lastIndex = Infinity;
  _pages = [];
  _options = [10, 20, 30, 40, 50];
  _showSizeChanger = false;
  _showQuickJumper = false;
  _showTotal = false;
  _simple = false;

  _offset: number;
  _limit: number = 10;

  /**
   * Whether can change pageSize, when add this property the page will change dropdown menu
   * 是否可以改变 pageSize，当添加该属性时显示页面改变下拉菜单
   * @param  value
   */
  @Input()
  set showSizeChanger(value: boolean) {
    this._showSizeChanger = value;
  }

  /**
   * Get show size changer
   * 获取是否可以改变pageSize
   */
  get showSizeChanger() {
    return this._showSizeChanger;
  }

  @Input()
  set showDetail(value: boolean) {}

  /**
   * Set whether can quick jump to some page, when add this property show quick jumper
   * 设置是否可以快速跳转至某页，当添加该属性时显示快速跳转
   * @param  value
   */
  @Input()
  set showQuickJumper(value: boolean) {
    this._showQuickJumper = value;
  }

  /**
   * Get whether can quick jump to some page
   * 获取是否可以快速跳转至某页
   */
  get showQuickJumper() {
    return this._showQuickJumper;
  }

  /**
   * Set this property then show total count data
   * 当添加该属性时，显示总共有多少条数据
   * @param  value
   */
  @Input()
  set showTotal(value: boolean) {
    this._showTotal = value;
  }

  /**
   * Get show total count data
   * 获取显示总共有多少条数据
   */
  get showTotal() {
    return this._showTotal;
  }

  /**
   * Set this property, show as simple pagination
   * 当添加该属性时，显示为简单分页
   * @param  value
   */
  @Input()
  set simple(value: boolean) {
    this._simple = value;
  }

  /**
   * Get whether simple pagination
   * 获取是否简单分页
   */
  get simple() {
    return this._simple;
  }

  @Input()
  set forPage({pageIndex, pageSize}: { pageIndex: number; pageSize: number }) {
    this.pageIndex = pageIndex;
    this.limit = pageSize;
  }

  /**
   * When [small], show small size pagination
   * 当为「small」时，是小尺寸分页
   */
  @Input() size: string;

  @Output() pageChange: EventEmitter<PageChangeEvent> = new EventEmitter();

  /**
   * the event of page size change
   */
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter();

  /**
   * the event of page index change
   */
  @Output() pageIndexChange: EventEmitter<number> = new EventEmitter();

  /**
   * the event of page index click change
   */
  @Output() pageIndexClickChange: EventEmitter<number> = new EventEmitter();

  _jumpBefore(pageSize) {
    this._jumpPage(this.pageIndex - Math.round(pageSize / 2));
  }

  _jumpAfter(pageSize) {
    this._jumpPage(this.pageIndex + Math.round(pageSize / 2));
  }

  /**
   * Get current page index
   * 获取当前页数(双向绑定)
   * @deprecated deprecated for input binding, please use forPage
   */
  @Input()
  get pageIndex(): number {
    return this._current;
  }

  /**
   * Set current page index
   * 设置当前分页
   * @param  value
   */
  set pageIndex(value: number) {
    value = Math.round(value);
    if (this._current !== value) {
      if (value < this._firstIndex) {
        value = this._firstIndex;
      } else if (value > this._lastIndex) {
        value = this._lastIndex;
      }
      // write into _current cache
      this._current = value;

      if (isFinite(this.limit)) {
        this.offset = (value - 1) * this.limit;
      } else {
        this.offset = value;
      }
      this.pageIndexChange.emit(value);
    }
  }

  /**
   * Limit
   * 限制
   */
  @Input('limit')
  get limit() {
    return this._limit;
  }

  set limit(value: number) {
    value = Math.round(value);
    if (value > 0 && value !== this._limit) {
      this._buildPageIndex();
      this._buildIndexes();
      this.pageSizeChange.emit(this._limit);
      this.pageChange.emit({skip: this._offset, take: this._limit});
    }
  }

  /**
   * Offset
   * 偏移量
   */
  @Input('offset')
  get offset() {
    return this._offset;
  }

  set offset(value: number) {
    const _offset = Math.abs(Number(value));
    if (this._offset !== _offset) {
      this._offset = _offset;
      this._buildPageIndex();
      this._buildIndexes();
      this.pageChange.emit({skip: this._offset, take: this._limit});
    }
  }

  /**
   * Get page size
   * 获取分页每页条数
   */
  @Input()
  get pageSize(): number {
    return this._offset;
  }

  /**
   * Set page size
   * 设置分页条数
   * @param  value
   * @deprecated
   */
  set pageSize(value: number) {
    console.warn(`the input of pagination page size is deprecated, please use skip offset instead`);
    this.offset = value;
  }

  /**
   * Get total count
   * 获取总条数
   */
  @Input()
  get total(): number {
    return this._total;
  }

  /**
   * Set total count
   * 设置总条数
   * @param  value
   */
  set total(value: number) {
    if (value === this._total) {
      return;
    }
    this._total = value;
    this._buildIndexes();
  }

  _pageSizeChange($event) {
    this.limit = $event;
  }

  _pageIndexChange($event) {
    this.pageIndex = $event;
  }

  _buildPageIndex() {
    this.pageIndex = Math.round(this._offset / this._limit) + 1;
  }

  /** generate indexes list */
  _buildIndexes() {
    this._lastIndex = Math.ceil(this._total / this._limit);

    const tmpPages = [];
    if (this._lastIndex <= 9) {
      for (let i = 2; i <= this._lastIndex - 1; i++) {
        tmpPages.push({index: i});
      }
    } else if (!isFinite(this._lastIndex)) {
    } else {
      const current = this.pageIndex;
      let left = Math.max(2, current - 2);
      let right = Math.min(current + 2, this._lastIndex - 1);

      // if (current - 1 <= 2) {
      //   right = 5;
      // }
      //
      // if (this._lastIndex - current <= 2) {
      //   left = this._lastIndex - 4;
      // }

      for (let i = left; i <= right; i++) {
        tmpPages.push({index: i});
      }
    }
    this._pages = tmpPages;
  }

  _jumpPage(index) {
    if (index === this.pageIndex) {
      return;
    }

    if (index < this._firstIndex) {
      this.pageIndex = this._firstIndex;
    } else if (index > this._lastIndex) {
      this.pageIndex = this._lastIndex;
    } else {
      this.pageIndex = index;
    }
    this.pageIndexClickChange.emit(this.pageIndex);
  }

  get _isLastIndex() {
    return this.pageIndex === this._lastIndex;
  }

  get _isFirstIndex() {
    return this.pageIndex === this._firstIndex;
  }

  get _roundPageSize() {
    return Math.round(this.limit / 2);
  }

  constructor(private _elementRef: ElementRef) {
    this._el = this._elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['skip'] || changes['offset'] || changes['limit'] || changes['take']) {
      if (changes['pageIndex'] || changes['pageSize']) {
        console.warn(
          `pageSize and pageIndex is incompatible with "skip offset limit take", ` +
          `pageSize and pageIndex is deprecated and it will not take effect. please consider to use skip take`
        );
      }
    }
    // if (anyChanged(['skip', 'offset', 'limit', 'take', 'pageIndex', 'pageSize'], changes, true)) {
    //   this.pageChange.emit({skip: this.offset, take: this.limit});
    // }
  }
}
