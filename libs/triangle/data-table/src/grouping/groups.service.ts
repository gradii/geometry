import { Skip } from '../utils';
import { Inject, Injectable, Optional } from '@angular/core';
import { ExpandStateService } from '../service/expand-state.service';

const removeLast = function (groupIndex) {
  return groupIndex.lastIndexOf('_') > -1 ? groupIndex.slice(0, groupIndex.lastIndexOf('_')) : '';
};

@Injectable()
export class GroupsService extends ExpandStateService {

  constructor( @Optional() @Inject(Skip) isCollapsed: boolean = false) {
    super(isCollapsed);
  }

  public isInExpandedGroup(groupIndex: string, skipSelf: boolean = true): boolean {
    if (skipSelf) {
      groupIndex = removeLast(groupIndex);
    }

    let expanded = true;

    while (groupIndex && expanded) {
      expanded = this.isExpanded(groupIndex);
      groupIndex = removeLast(groupIndex);
    }
    return expanded;
  }

  public expandChildren(groupIndex: string): void {
    this.rowState = this.rowState.filter((x: any) => !x.startsWith(groupIndex));
  }
}
