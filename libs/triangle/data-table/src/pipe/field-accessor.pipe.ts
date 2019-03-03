import { getter } from '@gradii/triangle/data-query';
import { isNullOrEmptyString } from '@gradii/triangle/util';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'valueOf', pure: false})
export class FieldAccessorPipe implements PipeTransform {
  constructor() {}

  transform(dataItem: any, fieldName: string, safe?: boolean): any {
    if (!isNullOrEmptyString(fieldName)) {
      return getter(fieldName, safe)(dataItem);
    }
    return dataItem;
  }
}
