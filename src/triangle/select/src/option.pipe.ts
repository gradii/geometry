/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Pipe, PipeTransform, QueryList } from '@angular/core';
import { OptionGroupComponent } from './option-group.component';
import { OptionComponent } from './option.component';

export type TFilterOption = (input: string, option: OptionComponent) => boolean;

@Pipe({name: 'triFilterOption'})
export class FilterOptionPipe implements PipeTransform {
  transform(
    options: OptionComponent[] | QueryList<OptionComponent>,
    searchValue: string,
    filterOption: TFilterOption,
    serverSearch: boolean
  ): OptionComponent[] | QueryList<OptionComponent> {
    if (serverSearch || !searchValue) {
      return options;
    } else {
      return (options as OptionComponent[]).filter(o => filterOption(searchValue, o));
    }
  }
}

@Pipe({name: 'triFilterGroupOption'})
export class FilterGroupOptionPipe implements PipeTransform {
  transform(
    groups: OptionGroupComponent[],
    searchValue: string,
    filterOption: TFilterOption,
    serverSearch: boolean
  ): OptionGroupComponent[] {
    if (serverSearch || !searchValue) {
      return groups;
    } else {
      return (groups as OptionGroupComponent[]).filter(g => {
        return g.listOfOptionComponent.some(o => filterOption(searchValue, o));
      });
    }
  }
}

export function defaultFilterOption(searchValue: string, option: OptionComponent): boolean {
  if (option && option.label) {
    return option.label.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  } else {
    return false;
  }
}
