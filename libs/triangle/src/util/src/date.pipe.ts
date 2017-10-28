import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'triDate' })
export class DatePipe implements PipeTransform {
  transform(value: Date, formatString: string): string {
    if (value) {
      return moment(+value).format(formatString);
    } else {
      return '';
    }
  }
}
