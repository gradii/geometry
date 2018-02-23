import { LoggerService } from '@gradii/triangle/util';
import { Inject, Injectable, Optional, Provider, SkipSelf } from '@angular/core';
import * as moment from 'moment';
import { Locale } from './locale.class';
import { LOCALE } from './locale.token';

@Injectable()
export class LocaleService {
  private _locale: Locale;

  constructor(@Inject(LOCALE) locale: Locale, private _logger: LoggerService) {
    this.setLocale(locale);
  }

  /**
   * [NOTE] Performance issue: this method may called by every change detections
   * TODO: cache more deeply paths for performance
   */
  translate(path: string, data?: any) {
    this._logger.debug(`[LocaleService] Translating(${this._locale.locale}): ${path}`);
    let content = this._getObjectPath(this._locale, path);
    if (typeof content === 'string') {
      if (data) {
        Object.keys(data).forEach(key => (content = content.replace(new RegExp(`%${key}%`, 'g'), data[key])));
      }
      return content;
    }
    return path;
  }

  /**
   * Set/Change current locale globally throughout the WHOLE application
   * [NOTE] If called at runtime, rendered interface may not change along with the locale change (because this do not trigger another render schedule)
   * @param locale The translating letters
   */
  setLocale(locale: Locale) {
    moment.locale(locale.locale);
    this._locale = locale;
  }

  getLocale() {
    return this._locale;
  }

  private _getObjectPath(obj: Object, path: string): any {
    const paths = path.split('.'),
          depth = paths.length;
    let index = 0;
    while (obj && index < depth) {
      obj = obj[paths[index++]];
    }
    return index === depth ? obj : null;
  }
}

export function LOCALE_SERVICE_PROVIDER_FACTORY(exist, locale, logger) {
  return exist || new LocaleService(locale, logger);
}

export const LOCALE_SERVICE_PROVIDER: Provider = {
  provide   : LocaleService,
  useFactory: LOCALE_SERVICE_PROVIDER_FACTORY,
  deps      : [[new Optional(), new SkipSelf(), LocaleService], LOCALE, LoggerService]
};
