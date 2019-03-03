import { GroupDescriptor } from '@gradii/triangle/data-query';
// tslint:disable:component-selector
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { GroupInfoService } from './group-info.service';

@Component({
  selector           : '[triGroupIndicator], tri-group-indicator',
  changeDetection    : ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  template           : `
    <a href="#" class="ant-link" (click)="toggleDirection()">
                       <span class="ant-icon"
                             [class.tri-i-sort-asc-sm]="dir === 'asc'"
                             [class.tri-i-sort-desc-sm]="dir === 'desc'"></span>
      {{title}}</a>
    <a class="ant-button ant-button-icon ant-bare" (click)="removeDescriptor()">
      <span class="ant-icon ant-i-group-delete"></span>
    </a>
  `
})
export class GroupIndicatorComponent {
  groupInfoService: GroupInfoService;
  @Output() directionChange: EventEmitter<GroupDescriptor>;
  @Output() remove: EventEmitter<GroupDescriptor>;
  @Input() group: GroupDescriptor;

  constructor(groupInfoService: GroupInfoService) {
    this.groupInfoService = groupInfoService;
    this.directionChange = new EventEmitter();
    this.remove = new EventEmitter();
  }

  @HostBinding('class.tri-group-indicator')
  get groupIndicatorClass(): boolean {
    return true;
  }

  get title(): string {
    return this.groupInfoService.groupTitle(this.group);
  }

  get dir(): string {
    return this.group.dir ? this.group.dir : 'asc';
  }

  toggleDirection(): boolean {
    this.directionChange.emit({
      dir  : this.dir === 'asc' ? 'desc' : 'asc',
      field: this.group.field
    });
    return false;
  }

  removeDescriptor(): boolean {
    this.remove.emit({
      dir  : this.group.dir,
      field: this.group.field
    });
    return false;
  }
}
