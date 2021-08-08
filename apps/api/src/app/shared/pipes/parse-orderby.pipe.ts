import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isString } from '../../core/check-type';


@Injectable()
export class ParseOrderbyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const orderDescriptions = [];
    if (isString(value) && value.length > 0) {
      value.split('|').map(it => {
        let [field, order] = it.split(',');
        if (!field) {
          return [];
        }
        if (!order) {
          order = 'asc';
        }
        order = order.toLowerCase();
        orderDescriptions.push([field, order === 'asc' || order === 'desc' ? order : 'asc']);
      });
    }
    return orderDescriptions;
  }
}
