import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { measureScrollbar } from '@gradii/triangle/util';
import { ThDirective } from './th.directive';

@Component({
  selector     : 'tri-table',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div
      class="tri-table-wrapper"
      [class.tri-table-empty]="data.length==0">
      <tri-spin [spinning]="loading">
        <div>
          <div
            class="tri-table"
            [class.tri-table-fixed-header]="scroll"
            [class.tri-table-scroll-position-left]="scroll"
            [class.tri-table-bordered]="bordered"
            [class.tri-table-large]="(size!=='middle')&&(size!=='small')"
            [class.tri-table-middle]="size=='middle'"
            [class.tri-table-small]="size=='small'">
            <div class="tri-table-title" *ngIf="showTitle">
              <ng-content select="[tri-table-title]"></ng-content>
            </div>
            <div class="tri-table-content">
              <div [class.tri-table-scroll]="scroll">
                <div class="tri-table-header" [ngStyle]="_headerBottomStyle" *ngIf="scroll">
                  <table>
                    <colgroup>
                      <col *ngFor="let th of ths" [style.width]="th.width" [style.minWidth]="th.width">
                    </colgroup>
                    <ng-template [ngTemplateOutlet]="fixedHeader"></ng-template>
                  </table>
                </div>
                <div class="tri-table-body" [style.maxHeight.px]="scroll?.y" [style.overflowY]="scroll?.y?'scroll':''">
                  <table>
                    <colgroup>
                      <col [style.width]="th.width" [style.minWidth]="th.width" *ngFor="let th of ths">
                    </colgroup>
                    <ng-content></ng-content>
                  </table>
                </div>
                <div class="tri-table-placeholder" *ngIf="data.length==0 && !customNoResult">
                  <span>没有数据</span>
                </div>
                <div class="tri-table-placeholder" *ngIf="data.length==0 && customNoResult">
                  <ng-content select="[noResult]"></ng-content>
                </div>
                <div class="tri-table-footer" *ngIf="showFooter">
                  <ng-content select="[tri-table-footer]"></ng-content>
                </div>
              </div>
            </div>
          </div>
        </div>
        <tri-pagination
          *ngIf="isPagination&&data.length"
          class="tri-table-pagination"
          [showSizeChanger]="showSizeChanger"
          [showQuickJumper]="showQuickJumper"
          [showTotal]="showTotal"
          [size]="(size=='middle'||size=='small')?'small':''"
          [offset]="offset"
          [limit]="limit"
          [total]="total">
        </tri-pagination>
      </tri-spin>
    </div>
  `
})
export class TableComponent implements AfterViewInit, OnInit {
  /** public data for ngFor tr */
  data = [];
  _scroll;
  _el: HTMLElement;
  _headerBottomStyle;
  _current = 1;
  _total: number;
  _pageSize = 10;
  _dataSet = [];
  _isInit = false;
  _isAjax = false;
  ths = [];
  @Output() pageSizeChange: EventEmitter<any> = new EventEmitter();
  @Output() pageIndexChange: EventEmitter<any> = new EventEmitter();
  @Output() dataChange: EventEmitter<any> = new EventEmitter();
  @Output() pageIndexChangeClick: EventEmitter<any> = new EventEmitter();
  @Input() bordered = false;
  @Input() size: string;
  @Input() customNoResult = false;
  @Input() isPagination = true;
  @Input() loading = false;
  @Input() showSizeChanger = false;
  @Input() showQuickJumper = false;
  @Input() showTotal = false;
  @Input() showFooter = false;
  @Input() showTitle = false;
  @Input() isPageIndexReset = true;
  @ContentChild('fixedHeader') fixedHeader: TemplateRef<any>;

  @ContentChildren(ThDirective, {descendants: true})
  set setThs(value: QueryList<ThDirective>) {
    this.ths = value.toArray();
  }

  @Input()
  set scroll(value) {
    this._scroll = value;
    this._cd.detectChanges();
  }

  get scroll() {
    return this._scroll;
  }

  /** async data */
  @Input()
  get ajaxData() {
    return this.data;
  }

  set ajaxData(data) {
    this._isAjax = true;
    this.data = data;
  }

  /** sync data */
  @Input()
  get dataSource() {
    return this._dataSet;
  }

  set dataSource(value) {
    this._dataSet = value;
    this.total = this._dataSet.length;
    this._generateData(true);
  }

  pageChangeClick(value) {
    this.pageIndexChangeClick.emit(value);
  }

  @Input()
  offset;

  @Input()
  limit;

  @Input()
  get total() {
    return this._total;
  }

  set total(value: number) {
    if (this._total === value) {
      return;
    }
    this._total = value;
  }

  _generateData(forceRefresh = false) {
    if (!this._isAjax) {
      if (this.isPagination) {
        this.data = this._dataSet.slice(this.offset, this.offset + this.limit);
      } else {
        this.data = this._dataSet;
      }
      this.dataChange.emit(this.data);
    }
  }

  ngOnInit() {
    const scrollbarWidth = measureScrollbar();
    this._headerBottomStyle = {
      marginBottom : `-${scrollbarWidth}px`,
      paddingBottom: `0px`
    };
  }

  constructor(private _elementRef: ElementRef, private _cd: ChangeDetectorRef) {
    this._el = this._elementRef.nativeElement;
  }

  ngAfterViewInit() {
    this._isInit = true;
  }
}
