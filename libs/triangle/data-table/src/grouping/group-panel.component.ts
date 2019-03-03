import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { GroupDescriptor } from '@gradii/triangle/data-query';
import { DraggableDirective } from '../table-shared/draggable.directive';
import { observe } from '../utils';
import { GroupConnectionService, GroupDragService } from './group-connection.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers      : [GroupDragService],
  selector       : 'tri-data-table-group-panel',
  template       : `
                     <ng-template [ngIf]="groups.length === 0">
                       {{ text }}
                     </ng-template>
                     <div *ngFor="let group of groups"
                          triGroupIndicator
                          tri-grid-draggable
                          [gridDraggable]="group"
                          [group]="group"
                          (directionChange)="directionChange($event)"
                          (remove)="remove($event)">
                     </div>
                   `
})
export class GroupPanelComponent implements AfterViewInit, OnDestroy {
  private connection;
  private draggableService;
  private localization;
  @Output() change: EventEmitter<GroupDescriptor[]>;
  @Input() groups: GroupDescriptor[];
  @ViewChildren(DraggableDirective) draggables: QueryList<DraggableDirective>;
  @ViewChildren(DraggableDirective) dropTargets: QueryList<ElementRef>;
  private emptyText;
  private subscription;

  constructor(connection: GroupConnectionService, draggableService: GroupDragService, element: ElementRef) {
    const _this = this;
    this.connection = connection;
    this.draggableService = draggableService;
    this.change = new EventEmitter();
    this.groups = [];
    this.subscription = connection.register(element.nativeElement).subscribe(_a => {
      const field = _a.field;
      const idx = _a.idx;
      return _this.insert(field, idx);
    });
  }

  @HostBinding('class.tri-grouping-header')
  get groupHeaderClass() {
    return true;
  }

  @Input()
  get text() {
    return this.emptyText ? this.emptyText : this.localization.get('groupPanelEmpty');
  }

  set text(value) {
    this.emptyText = value;
  }

  ngAfterViewInit() {
    const _this = this;
    this.subscription.add(
      observe(this.dropTargets).subscribe(items => _this.connection.registerItems(items.map(x => x.nativeElement)))
    );
    this.subscription.add(
      observe(this.draggables).subscribe((items: any) => _this.draggableService.connect(items.toArray()))
    );
  }

  ngOnDestroy() {
    this.draggableService.unsubscribe();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  directionChange(group: GroupDescriptor): void {
    const index = this.groups.findIndex(x => x.field === group.field);
    const groups = this.groups.slice(0, index).concat([group], this.groups.slice(index + 1));
    this.change.emit(groups);
  }

  insert(field: string, index: number): void {
    const groups = this.groups.filter(x => x.field !== field);
    if (groups.length || this.groups.length === 0) {
      this.change.emit(groups.slice(0, index).concat([{field}], groups.slice(index)));
    }
  }

  remove(group: GroupDescriptor): void {
    this.change.emit(this.groups.filter(x => x.field !== group.field));
  }
}
