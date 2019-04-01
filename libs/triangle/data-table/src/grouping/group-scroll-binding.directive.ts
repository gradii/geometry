import {
  CompositeFilterDescriptor,
  filterBy,
  GroupDescriptor,
  process,
  SortDescriptor,
  State
} from '@gradii/triangle/data-query';
import { isArray, isPresent } from '@gradii/triangle/util';
import { Directive, Input } from '@angular/core';
import { GridDataResult } from '../data-collection/data-result-iterator';
import { DataTableComponent } from '../data-table.component';
import { DataBindingDirective } from '../directive/databinding.directive';
import { VirtualGroupResult } from './virtual-group-result.interface';

const hasGroups = (items) => items && items.length && items[0].field && items[0].items;

const processGroups = (data: any[], state: State) => process(data, state).data;

const removeParentDescriptors = (parents, owner) => g => g.field !== owner.field && !parents.some(y => y.field === g.field);

const findGroup = (groupIndex, groups) => {
  const parents = [];
  return {
    group: groupIndex.split('_').reduce(
      (acc, x) => {
        const idx = parseInt(x, 10);
        if (acc.items) {
          parents.push(acc);
          return acc.items[idx];
        }
        return isArray(acc) ? acc[idx] : acc;
      },
      groups
    ),
    parents
  };
};

const findChildren = <T>(data: T[], parents: any[]): T[] => {
  const filters = parents.map(p => ({field: p.field, operator: 'eq', value: p.value}));
  return filterBy(data, {
    filters: filters,
    logic  : 'and'
  });
};

/**
 * @hidden
 */
export const count = (groups: any[], includeFooters: boolean = false) => (
  groups.reduce((acc, group) => {
    if (!group.skipHeader) {
      acc++;
    }
    if (group.items) {
      const children = count(group.items, includeFooters);

      if (includeFooters && children && !group.hideFooter) {
        acc++;
      }

      acc += children;
    }
    return acc;
  }, 0) // tslint:disable-line:align
);

/**
 * @hidden
 */
export const slice = (groups: any[], skip: number, take: number, includeFooters: boolean = false): VirtualGroupResult[] => {
  if (!isPresent(take)) {
    return groups;
  }

  const result = [];

  for (let idx = 0, length = groups.length; idx < length; idx++) {
    if (take <= 0) {
      break;
    }

    const group = groups[idx];
    const groupItems = group.items;

    let itemCount = count(groupItems, includeFooters);

    if (includeFooters && groupItems.length) {
      itemCount++;
    }

    const skipHeader = skip > 0;
    if (skip) {
      skip--;

      if (itemCount && skip >= itemCount) {
        skip -= itemCount;
        continue;
      }
    }

    if (!skipHeader || itemCount) {
      const items = [];

      let hideFooter = true;

      if (!skipHeader) {
        take--;
      }

      if (take) {
        if (hasGroups(groupItems)) {
          const children = slice(groupItems, skip, take, includeFooters);
          items.push(...children);
          take -= count(children, includeFooters);
        } else {
          items.push(...groupItems.slice(skip, Math.min(skip + take, groupItems.length)));
          take -= items.length;
        }

        if (take && includeFooters) {
          hideFooter = false;
          take--;
        }

        skip = 0;
      }

      result.push({
        aggregates: group.aggregates,
        field     : group.field,
        hideFooter,
        items,
        offset    : idx,
        skipHeader,
        value     : group.value
      });
    }
  }

  return result;
};

function diffFilters(filter: CompositeFilterDescriptor, value: CompositeFilterDescriptor): boolean {
  //todo
  return false;
}

function cloneFilters(value: CompositeFilterDescriptor) {
  //todo
  return undefined;
}

class LocalDataChangesService {
}

/**
 * A directive which encapsulates the in-memory handling of grouping with virtual scrolling.
 */
@Directive({selector: '[triGridGroupBinding]'})
export class GroupBindingDirective extends DataBindingDirective {

  /**
   * The array of data which will be used to populate the Grid.
   */
  @Input('triGridGroupBinding')
  public set kendoGridGroupBinding(value: any[]) {
    this.groups = null;
    this.grid.resetGroupsState();

    this.data = value;
  }

  /**
   * @hidden
   */
  public set data(value: any[]) {
    this.originalData = value || [];
    this.grid.data = this.process(this.state);
  }

  /**
   * Defines the descriptors by which the data will be sorted.
   */
  @Input()
  public set sort(value: SortDescriptor[]) {
    const clear = this.state.sort !== value;
    this.grid.sort = this.state.sort = value;

    if (clear) {
      this.groups = null;
      this.grid.resetGroupsState();
    }
  }

  /**
   * Defines the descriptor by which the data will be filtered.
   */
  @Input()
  public set filter(value: CompositeFilterDescriptor) {
    const clear = diffFilters(this.state.filter, value);

    if (clear) {
      this.state.filter = value;
      this.grid.filter = isPresent(value) ? cloneFilters(value) : value;
      this.groups = null;
      this.grid.resetGroupsState();
    }
  }

  /**
   * Defines the descriptors by which the data will be grouped.
   */
  @Input()
  public set group(value: GroupDescriptor[]) {
    const clear = this.state.group !== value;
    this.grid.group = this.state.group = value;

    if (clear) {
      this.groups = null;
      this.grid.resetGroupsState();
      this.skip = 0;
    }
  }

  private groups: any[];

  constructor(grid: DataTableComponent) {
    super(grid);
  }

  /**
   * @hidden
   */
  public ngOnInit(): void {
    super.ngOnInit();
    this.grid.groupExpand.subscribe(this.groupExpand.bind(this));
    this.grid.groupCollapse.subscribe(this.groupCollapse.bind(this));
  }

  protected groupExpand({groupIndex}: any): void {
    this.grid.expandGroupChildren(groupIndex);
    const {group, parents} = findGroup(groupIndex, this.groups);

    if (!group.items.length) {
      const descriptors = this.state.group.filter(removeParentDescriptors(parents, group));
      const children = findChildren(this.originalData, parents.concat(group));
      group.items = processGroups(children, {
        filter: this.state.filter,
        group : descriptors,
        sort  : this.state.sort
      });
    }

    this.grid.data = this.dataResult(this.state.skip, this.state.take);
  }

  protected groupCollapse({groupIndex}: any): void {

    const {group} = findGroup(groupIndex, this.groups);

    if (group) {
      group.items = [];
    }

    this.grid.data = this.dataResult(this.state.skip, this.state.take);
  }

  process(state: State): GridDataResult {
    if (state.group && state.group.length) {
      return this.processGroups(state);
    } else {
      this.groups = null;
    }
    return super.process(state);
  }

  protected processGroups(state: State): GridDataResult {
    if (!this.groups || !this.groups.length) {
      this.groups = processGroups(this.originalData, {
        filter: state.filter,
        group : state.group,
        sort  : state.sort
      });
    }
    return this.dataResult(state.skip, state.take);
  }

  protected dataResult(skip: number, take: number): GridDataResult {
    const includeFooters = this.grid.showGroupFooters;

    return {
      data : slice(this.groups, skip, take, includeFooters),
      total: count(this.groups, includeFooters)
    };
  }

  applyState({skip, take, sort, group, filter}: State): void {
    this.skip = skip;
    this.state.take = take;
    // this.pageSize = take; // do need to update take as the process with slice correctly
    this.sort = sort;
    this.group = group;
    this.filter = filter;
  }
}
