import { LocaleService } from '@gradii/triangle/locale';
import { coerceBoolean } from '@gradii/triangle/util';
// tslint:disable:member-ordering
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { TransferItem } from './item';

export interface TransferCanMove {
  direction: string;
  list: TransferItem[];
}

export interface TransferChange {
  from: string;
  to: string;
  list: TransferItem[];
}

export interface TransferSearchChange {
  direction: string;
  value: string;
}

export interface TransferSelectChange {
  direction: string;
  checked: boolean;
  list: TransferItem[];
  item: TransferItem;
}

@Component({
  selector       : 'tri-transfer',
  template       : `
    <tri-transfer-list class="ant-transfer-list" [ngStyle]="listStyle" data-direction="left"
                       [titleText]="titles[0]"
                       [dataSource]="leftDataSource"
                       [filter]="leftFilter"
                       [filterOption]="filterOption"
                       (filterChange)="handleFilterChange($event)"
                       [render]="render"
                       [showSearch]="showSearch"
                       [searchPlaceholder]="searchPlaceholder"
                       [notFoundContent]="notFoundContent"
                       [itemUnit]="itemUnit"
                       [itemsUnit]="itemsUnit"
                       [footer]="footer"
                       (handleSelect)="handleLeftSelect($event)"
                       (handleSelectAll)="handleLeftSelectAll($event)"></tri-transfer-list>
    <div class="ant-transfer-operation">
      <button tri-button (click)="moveToLeft()" [disabled]="!leftActive" [type]="'primary'" [size]="'small'">
        <i class="anticon anticon-left"></i><span *ngIf="operations[1]">{{ nzOperations[1] }}</span>
      </button>
      <button tri-button (click)="moveToRight()" [disabled]="!rightActive" [type]="'primary'" [size]="'small'">
        <i class="anticon anticon-right"></i><span *ngIf="operations[0]">{{ operations[0] }}</span>
      </button>
    </div>
    <tri-transfer-list class="ant-transfer-list" [ngStyle]="listStyle" data-direction="right"
                       [titleText]="titles[1]"
                       [dataSource]="rightDataSource"
                       [filter]="rightFilter"
                       [filterOption]="filterOption"
                       (filterChange)="handleFilterChange($event)"
                       [render]="render"
                       [showSearch]="showSearch"
                       [searchPlaceholder]="searchPlaceholder"
                       [notFoundContent]="notFoundContent"
                       [itemUnit]="itemUnit"
                       [itemsUnit]="itemsUnit"
                       [footer]="footer"
                       (handleSelect)="handleRightSelect($event)"
                       (handleSelectAll)="handleRightSelectAll($event)"></tri-transfer-list>
  `,
  encapsulation  : ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host           : {
    '[class.ant-transfer]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferComponent implements OnChanges {
  private _showSearch = false;

  leftFilter = '';
  rightFilter = '';

  // region: fields

  @Input() dataSource: TransferItem[] = [];
  @Input() titles: string[] = this._locale.translate('Transfer.titles').split(',');
  @Input() operations: string[] = [];
  @Input() listStyle: object;
  @Input() itemUnit = this._locale.translate('Transfer.itemUnit');
  @Input() itemsUnit = this._locale.translate('Transfer.itemsUnit');
  @Input() canMove: (arg: TransferCanMove) => Observable<TransferItem[]> = (arg: TransferCanMove) => of(arg.list);
  @ContentChild('render') render: TemplateRef<void>;
  @ContentChild('footer') footer: TemplateRef<void>;

  // search
  @Input()
  set showSearch(value: boolean) {
    this._showSearch = coerceBoolean(value);
  }

  get showSearch(): boolean {
    return this._showSearch;
  }

  @Input() filterOption: (inputValue: string, item: TransferItem) => boolean;
  @Input() searchPlaceholder = this._locale.translate('Transfer.searchPlaceholder');
  @Input() notFoundContent = this._locale.translate('Transfer.notFoundContent');

  // events
  @Output() change: EventEmitter<TransferChange> = new EventEmitter();
  @Output() searchChange: EventEmitter<TransferSearchChange> = new EventEmitter();
  @Output() selectionChange: EventEmitter<TransferSelectChange> = new EventEmitter();

  // endregion

  // region: process data

  // left
  leftDataSource: TransferItem[] = [];

  // right
  rightDataSource: TransferItem[] = [];

  private splitDataSource(): void {
    this.leftDataSource = [];
    this.rightDataSource = [];
    this.dataSource.forEach(record => {
      if (record.direction === 'right') {
        this.rightDataSource.push(record);
      } else {
        this.leftDataSource.push(record);
      }
    });
  }

  private getCheckedData(direction: string): TransferItem[] {
    return this[direction === 'left' ? 'leftDataSource' : 'rightDataSource'].filter(w => w.checked);
  }

  handleLeftSelectAll = (checked: boolean) => this.handleSelect('left', checked);
  handleRightSelectAll = (checked: boolean) => this.handleSelect('right', checked);

  handleLeftSelect = (item: TransferItem) => this.handleSelect('left', item.checked, item);
  handleRightSelect = (item: TransferItem) => this.handleSelect('right', item.checked, item);

  handleSelect(direction: 'left' | 'right', checked: boolean, item?: TransferItem): void {
    const list = this.getCheckedData(direction);
    this.updateOperationStatus(direction, list.length);
    this.selectionChange.emit({direction, checked, list, item});
  }

  handleFilterChange(ret: { direction: string; value: string }): void {
    this.searchChange.emit(ret);
    this.cd.detectChanges();
  }

  // endregion

  // region: operation

  leftActive = false;
  rightActive = false;

  private updateOperationStatus(direction: string, count?: number): void {
    this[direction === 'right' ? 'leftActive' : 'rightActive'] =
      (typeof count === 'undefined' ? this.getCheckedData(direction).filter(w => !w.disabled).length : count) > 0;
    this.cd.detectChanges();
  }

  moveToLeft = () => this.moveTo('left');
  moveToRight = () => this.moveTo('right');

  moveTo(direction: string): void {
    const oppositeDirection = direction === 'left' ? 'right' : 'left';
    this.updateOperationStatus(oppositeDirection, 0);
    const datasource = direction === 'left' ? this.rightDataSource : this.leftDataSource;
    const moveList = datasource.filter(item => item.checked === true && !item.disabled);
    this.canMove({direction, list: moveList}).subscribe(
      newMoveList => this.truthMoveTo(direction, newMoveList.filter(i => !!i)),
      () => moveList.forEach(i => (i.checked = false))
    );
  }

  private truthMoveTo(direction: string, list: TransferItem[]): void {
    const oppositeDirection = direction === 'left' ? 'right' : 'left';
    const datasource = direction === 'left' ? this.rightDataSource : this.leftDataSource;
    const targetDatasource = direction === 'left' ? this.leftDataSource : this.rightDataSource;
    for (const item of list) {
      const idx = datasource.indexOf(item);
      if (idx === -1) continue;
      item.checked = false;
      targetDatasource.push(item);
      datasource.splice(idx, 1);
    }
    this.updateOperationStatus(oppositeDirection);
    this.change.emit({
      from: oppositeDirection,
      to  : direction,
      list
    });
  }

  // endregion

  constructor(private _locale: LocaleService, private el: ElementRef, private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('dataSource' in changes || 'targetKeys' in changes) {
      this.splitDataSource();
      this.updateOperationStatus('left');
      this.updateOperationStatus('right');
    }
    this.cd.detectChanges();
  }
}
