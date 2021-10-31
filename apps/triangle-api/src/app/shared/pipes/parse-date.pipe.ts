import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import parseDate from 'date-fns/parse';
import { isValid } from 'date-fns';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    let d;
    try {
      d = parseDate(value, "yyyy-MM-dd'T'HH:mm:ssX", new Date());
    } catch (e) {
      return new Date(value);
    }
    if (isValid(d)) {
      return d;
    } else {
      return new Date(value);
    }

  }
}
