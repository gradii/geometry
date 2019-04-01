import { Pipe, PipeTransform } from '@angular/core';

import { I18nService } from './i18n.service';

@Pipe({
  name: 'triI18n'
})
export class I18nPipe implements PipeTransform {
  constructor(private _locale: I18nService) {
  }

  transform(path: string, keyValue?: object): string {
    return this._locale.translate(path, keyValue);
  }
}
