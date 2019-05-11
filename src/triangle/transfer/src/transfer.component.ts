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
import { I18nService } from '@gradii/triangle/i18n';
import { coerceToBoolean } from '@gradii/triangle/util';
import { Observable, of } from 'rxjs';
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
    <tri-transfer-list class="tri-transfer-list" [ngStyle]="listStyle" data-direction="left"
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
    <div class="tri-transfer-operation">
      <button tri-button (click)="moveToLeft()" [disabled]="!leftActive" [color]="'primary'" [size]="'small'">
        <i class="anticon anticon-left"></i><span *ngIf="operations[1]">{{ operations[1] }}</span>
      </button>
      <button tri-button (click)="moveToRight()" [disabled]="!rightActive" [color]="'primary'" [size]="'small'">
        <i class="anticon anticon-right"></i><span *ngIf="operations[0]">{{ operations[0] }}</span>
      </button>
    </div>
    <tri-transfer-list class="tri-transfer-list" [ngStyle]="listStyle" data-direction="right"
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
    '[class.tri-transfer]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferComponent implements OnChanges {
  leftFilter = '';
  rightFilter = '';
  @Input() dataSource: TransferItem[] = [];

  // region: fields
  @Input() titles: string[] = this.localization.translate('Transfer.titles').split(',');
  @Input() operations: string[] = [];
  @Input() listStyle: object;
  @Input() itemUnit = this.localization.translate('Transfer.itemUnit');
  @Input() itemsUnit = this.localization.translate('Transfer.itemsUnit');
  @ContentChild('render', {static: false}) render: TemplateRef<void>;
  @ContentChild('footer', {static: false}) footer: TemplateRef<void>;
  @Input() filterOption: (inputValue: string, item: TransferItem) => boolean;
  @Input() searchPlaceholder = this.localization.translate('Transfer.searchPlaceholder');
  @Input() notFoundContent = this.localization.translate('Empty.description');
  // events
  @Output() change: EventEmitter<TransferChange> = new EventEmitter();
  @Output() searchChange: EventEmitter<TransferSearchChange> = new EventEmitter();
  @Output() selectionChange: EventEmitter<TransferSelectChange> = new EventEmitter();
  // left
  leftDataSource: TransferItem[] = [];
  // right
  rightDataSource: TransferItem[] = [];
  leftActive = false;
  rightActive = false;

  // endregion

  // region: process data

  constructor(private localization: I18nService, private el: ElementRef, private cd: ChangeDetectorRef) {}

  private _showSearch = false;

  get showSearch(): boolean {
    return this._showSearch;
  }

  // search
  @Input()
  set showSearch(value: boolean) {
    this._showSearch = coerceToBoolean(value);
  }

  @Input() canMove: (arg: TransferCanMove) => Observable<TransferItem[]> = (arg: TransferCanMove) => of(arg.list);

  handleLeftSelectAll = (checked: boolean) => this.handleSelect('left', checked);

  handleRightSelectAll = (checked: boolean) => this.handleSelect('right', checked);

  handleLeftSelect = (item: TransferItem) => this.handleSelect('left', item.checked, item);

  handleRightSelect = (item: TransferItem) => this.handleSelect('right', item.checked, item);

  handleSelect(direction: 'left' | 'right', checked: boolean, item?: TransferItem): void {
    const list = this.getCheckedData(direction);
    this.updateOperationStatus(direction, list.length);
    this.selectionChange.emit({direction, checked, list, item});
  }

  // endregion

  // region: operation

  handleFilterChange(ret: { direction: string; value: string }): void {
    this.searchChange.emit(ret);
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

  ngOnChanges(changes: SimpleChanges): void {
    if ('dataSource' in changes || 'targetKeys' in changes) {
      this.splitDataSource();
      this.updateOperationStatus('left');
      this.updateOperationStatus('right');
    }
    this.cd.detectChanges();
  }

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

  // endregion

  private updateOperationStatus(direction: string, count?: number): void {
    this[direction === 'right' ? 'leftActive' : 'rightActive'] =
      (typeof count === 'undefined' ? this.getCheckedData(direction).filter(w => !w.disabled).length : count) > 0;
    this.cd.detectChanges();
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
}
