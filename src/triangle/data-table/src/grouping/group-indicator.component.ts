// tslint:disable:component-selector
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import { GroupDescriptor } from '@gradii/triangle/data-query';
import { GroupInfoService } from './group-info.service';

@Component({
  selector           : '[triGroupIndicator], tri-group-indicator',
  changeDetection    : ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  template           : `
    <a href="#" class="tri-link" tabindex="-1" (click)="toggleDirection()">
         <span class="tri-icon"
               [class.tri-i-sort-asc-sm]="dir === 'asc'"
               [class.tri-i-sort-desc-sm]="dir === 'desc'"></span>
      {{title}}</a>
    <a class="tri-button tri-button-icon tri-bare" tabindex="-1" (click)="removeDescriptor()">
      <span class="tri-icon tri-i-group-delete"></span>
    </a>
  `
})
export class GroupIndicatorComponent {
  @Output() public directionChange: EventEmitter<GroupDescriptor> = new EventEmitter<GroupDescriptor>();
  @Output() public remove: EventEmitter<GroupDescriptor> = new EventEmitter<GroupDescriptor>();

  @Input() public group: GroupDescriptor;

  constructor(public groupInfoService: GroupInfoService) { }

  @HostBinding('class.k-group-indicator')
  public get groupIndicatorClass(): boolean {
    return true;
  }

  public get title(): string {
    return this.groupInfoService.groupTitle(this.group);
  }

  public get dir(): string {
    return this.group.dir ? this.group.dir : 'asc';
  }

  public toggleDirection(): boolean {
    this.directionChange.emit({
      dir  : this.dir === 'asc' ? 'desc' : 'asc',
      field: this.group.field
    });
    return false;
  }

  public removeDescriptor(): boolean {
    this.remove.emit({
      dir  : this.group.dir,
      field: this.group.field
    });
    return false;
  }
}
