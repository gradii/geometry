import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from './locale.service';

@Pipe({
  name: 'triTranslate'
})
export class TranslatePipe implements PipeTransform {
  constructor(private _locale: LocaleService) {}

  transform(path: string, keyValue?: Object): any {
    return this._locale.translate(path, keyValue);
  }
}
