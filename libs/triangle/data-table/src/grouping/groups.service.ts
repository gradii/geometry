import { Injectable } from '@angular/core';
import { ExpandStateService } from '../service/expand-state.service';

const removeLast = function (groupIndex) {
  return groupIndex.lastIndexOf('_') > -1 ? groupIndex.slice(0, groupIndex.lastIndexOf('_')) : '';
};

@Injectable()
export class GroupsService extends ExpandStateService {
  isInExpandedGroup(groupIndex: string, skipSelf?: boolean): boolean {
    if (skipSelf === void 0) {
      skipSelf = true;
    }
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

  isExpanded(index: any): boolean {
    return !super.isExpanded(index);
  }
}
