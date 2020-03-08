/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

// tslint:disable:member-ordering
import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { coerceToBoolean } from '@gradii/triangle/util';
import { TransferItem } from './item';

@Component({
  selector: 'tri-transfer-list',
  template: `
      <div class="tri-transfer-list-header">
          <tri-checkbox [(ngModel)]="stat.checkAll" (ngModelChange)="onHandleSelectAll($event)"
                        [indeterminate]="stat.checkHalf"></tri-checkbox>
          <span class="tri-transfer-list-header-selected">
        <span>{{ (stat.checkCount > 0 ? stat.checkCount + '/' : '') + stat.shownCount }} {{ dataSource.length > 1 ? itemsUnit : itemUnit }}</span>
        <span *ngIf="titleText" class="tri-transfer-list-header-title">{{ titleText }}</span>
      </span>
      </div>
      <div class="{{showSearch ? 'tri-transfer-list-body tri-transfer-list-body-with-search' : 'tri-transfer-list-body'}}"
           [ngClass]="{'tri-transfer__nodata': stat.shownCount === 0}">
          <div *ngIf="showSearch" class="tri-transfer-list-body-search-wrapper">
              <tri-transfer-search class="tri-transfer-list-search"
                                   (valueChanged)="handleFilter($event)"
                                   (valueClear)="handleClear()"
                                   [placeholder]="searchPlaceholder"
                                   [value]="filter"></tri-transfer-search>
          </div>
          <ul class="tri-transfer-list-content">
              <ng-container *ngFor="let item of dataSource">
                  <li *ngIf="!item._hiden" (click)="_handleSelect(item)"
                      class="tri-transfer-list-content-item">
                      <label tri-checkbox [ngModel]="item.checked" [disabled]="item.disabled">
              <span>
                <ng-container *ngIf="!render; else renderContainer">{{ item.title }}</ng-container>
                <ng-template #renderContainer [ngTemplateOutlet]="render"
                             [ngTemplateOutletContext]="{ $implicit: item }"></ng-template>
              </span>
                      </label>
                  </li>
              </ng-container>
          </ul>
          <div class="tri-transfer-list-body-not-found">{{ notFoundContent }}</div>
      </div>
      <div *ngIf="footer" class="tri-transfer-list-footer">
          <ng-template [ngTemplateOutlet]="footer"
                       [ngTemplateOutletContext]="{ $implicit: direction }"></ng-template>
      </div>
  `
})
export class TransferListComponent implements OnChanges, OnInit, DoCheck {
  @Input() direction = '';

  // region: fields
  @Input() titleText = '';
  @Input() dataSource: TransferItem[] = [];
  @Input() itemUnit = '';
  @Input() itemsUnit = '';
  @Input() filter = '';
  @Input() searchPlaceholder: string;
  @Input() notFoundContent: string;
  @Input() filterOption: (inputValue: string, item: TransferItem) => boolean;
  @Input() render: TemplateRef<void>;
  @Input() footer: TemplateRef<void>;
  // events
  @Output() handleSelectAll: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() handleSelect: EventEmitter<TransferItem> = new EventEmitter();
  @Output() filterChange: EventEmitter<{ direction: string; value: string }> = new EventEmitter();
  _prefixCls = 'tri-transfer-list';
  _classList: string[] = [];
  stat = {
    checkAll  : false,
    checkHalf : false,
    checkCount: 0,
    shownCount: 0
  };

  // endregion

  // region: styles
  _listDiffer: IterableDiffer<{}>;

  constructor(private _el: ElementRef, private _renderer: Renderer2, differs: IterableDiffers) {
    this._listDiffer = differs.find([]).create(null);
  }

  private _showSearch = false;

  // endregion

  // region: select all

  get showSearch(): boolean {
    return this._showSearch;
  }

  // search
  @Input()
  set showSearch(value: boolean) {
    this._showSearch = coerceToBoolean(value);
  }

  _setClassMap(): void {
    this._classList.forEach(cls => this._renderer.removeClass(this._el.nativeElement, cls));

    this._classList = [this._prefixCls, !!this.footer && `${this._prefixCls}-with-footer`].filter(item => !!item);

    this._classList.forEach(cls => this._renderer.addClass(this._el.nativeElement, cls));
  }

  // endregion

  // region: search

  onHandleSelectAll(status: boolean): void {
    this.dataSource.forEach(item => {
      if (!item.disabled && !item._hiden) {
        item.checked = status;
      }
    });

    // // ngModelChange 事件内对状态的变更会无效，因此使用延迟改变执行顺序
    // setTimeout(() => this.updateCheckStatus());
    this.updateCheckStatus();
    this.handleSelectAll.emit(status);
  }

  handleFilter(value: string): void {
    this.filter = value;
    this.dataSource.forEach(item => {
      item._hiden = value.length > 0 && !this.matchFilter(value, item);
    });
    this.stat.shownCount = this.dataSource.filter(w => !w._hiden).length;
    this.filterChange.emit({direction: this.direction, value});
  }

  handleClear(): void {
    this.handleFilter('');
  }

  // endregion

  ngOnChanges(changes: SimpleChanges): void {
    if ('footer' in changes) {
      this._setClassMap();
    }
  }

  ngOnInit(): void {
    this._setClassMap();
  }

  ngDoCheck(): void {
    const change = this._listDiffer.diff(this.dataSource);
    if (change) {
      this.updateCheckStatus();
    }
  }

  _handleSelect(item: TransferItem): void {
    if (item.disabled) {
      return;
    }
    item.checked = !item.checked;
    this.updateCheckStatus();
    this.handleSelect.emit(item);
  }

  private updateCheckStatus(): void {
    const validCount = this.dataSource.filter(w => !w.disabled).length;
    this.stat.checkCount = this.dataSource.filter(w => w.checked && !w.disabled).length;
    this.stat.shownCount = this.dataSource.filter(w => !w._hiden).length;
    this.stat.checkAll = validCount > 0 && validCount === this.stat.checkCount;
    this.stat.checkHalf = this.stat.checkCount > 0 && !this.stat.checkAll;
  }

  private matchFilter(text: string, item: TransferItem): boolean {
    if (this.filterOption) {
      return this.filterOption(text, item);
    }
    return item.title.includes(text);
  }
}
