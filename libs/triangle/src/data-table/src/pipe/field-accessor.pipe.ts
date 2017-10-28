import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrEmptyString, isPresent } from '../utils';
import { getter } from '@gradii/triangle/data-query';
@Pipe({ name: 'valueOf', pure: false })
export class FieldAccessorPipe implements PipeTransform {
  constructor() {}
  transform(dataItem: any, fieldName: string, safe?: boolean): any {
    if (!isNullOrEmptyString(fieldName)) {
      const value = getter(fieldName, safe)(dataItem);
      return value;
    }
    return dataItem;
  }
}
