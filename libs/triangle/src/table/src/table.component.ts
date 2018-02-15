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
      class="ant-table-wrapper"
      [class.ant-table-empty]="data.length==0">
      <tri-spin [spinning]="loading">
        <div>
          <div
            class="ant-table"
            [class.ant-table-fixed-header]="scroll"
            [class.ant-table-scroll-position-left]="scroll"
            [class.ant-table-bordered]="bordered"
            [class.ant-table-large]="(size!=='middle')&&(size!=='small')"
            [class.ant-table-middle]="size=='middle'"
            [class.ant-table-small]="size=='small'">
            <div class="ant-table-title" *ngIf="showTitle">
              <ng-content select="[tri-table-title]"></ng-content>
            </div>
            <div class="ant-table-content">
              <div [class.ant-table-scroll]="scroll">
                <div class="ant-table-header" [ngStyle]="_headerBottomStyle" *ngIf="scroll">
                  <table>
                    <colgroup>
                      <col *ngFor="let th of ths" [style.width]="th.width" [style.minWidth]="th.width">
                    </colgroup>
                    <ng-template [ngTemplateOutlet]="fixedHeader"></ng-template>
                  </table>
                </div>
                <div class="ant-table-body" [style.maxHeight.px]="scroll?.y" [style.overflowY]="scroll?.y?'scroll':''">
                  <table>
                    <colgroup>
                      <col [style.width]="th.width" [style.minWidth]="th.width" *ngFor="let th of ths">
                    </colgroup>
                    <ng-content></ng-content>
                  </table>
                </div>
                <div class="ant-table-placeholder" *ngIf="data.length==0 && !customNoResult">
                  <span>没有数据</span>
                </div>
                <div class="ant-table-placeholder" *ngIf="data.length==0 && customNoResult">
                  <ng-content select="[noResult]"></ng-content>
                </div>
                <div class="ant-table-footer" *ngIf="showFooter">
                  <ng-content select="[tri-table-footer]"></ng-content>
                </div>
              </div>
            </div>
          </div>
        </div>
        <tri-pagination
          *ngIf="isPagination&&data.length"
          class="ant-table-pagination"
          [showSizeChanger]="showSizeChanger"
          [showQuickJumper]="showQuickJumper"
          [showTotal]="showTotal"
          [size]="(size=='middle'||size=='small')?'small':''"
          [(pageSize)]="pageSize"
          [total]="total"
          [(pageIndex)]="pageIndex"
          (pageIndexClickChange)="pageChangeClick($event)">
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

  @Input()
  get pageIndex() {
    return this._current;
  }

  set pageIndex(value: number) {
    if (this._current === value) {
      return;
    }
    this._current = value;
    this._generateData();
    this.pageIndexChange.emit(this.pageIndex);
  }

  pageChangeClick(value) {
    this.pageIndexChangeClick.emit(value);
  }

  @Input()
  get pageSize() {
    return this._pageSize;
  }

  set pageSize(value: number) {
    if (this._pageSize === value) {
      return;
    }
    this._pageSize = value;
    this._generateData();
    if (this._isInit) {
      this.pageSizeChange.emit(value);
    }
  }

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
        if (forceRefresh) {
          if (this.isPageIndexReset) {
            this.pageIndex = 1;
          } else {
            const maxPageIndex = Math.ceil(this._dataSet.length / this.pageSize);
            this.pageIndex = !this.pageIndex ? 1 : this.pageIndex > maxPageIndex ? maxPageIndex : this.pageIndex;
          }
        }
        this.data = this._dataSet.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize);
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
