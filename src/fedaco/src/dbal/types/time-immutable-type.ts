/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DateTimeImmutable } from 'ROOT';
import { TimeType } from './TimeType';

/*Immutable type of {@see TimeType}.*/
export class TimeImmutableType extends TimeType {
  /*{@inheritdoc}*/
  public getName() {
    return Types.TIME_IMMUTABLE;
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (value === null) {
      return value;
    }
    if (value instanceof DateTimeImmutable) {
      return value.format(platform.getTimeFormatString());
    }
    throw ConversionException.conversionFailedInvalidType(
      value,
      this.getName(),
      ['null', DateTimeImmutable]
    );
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value === null || value instanceof DateTimeImmutable) {
      return value;
    }
    let dateTime = DateTimeImmutable.createFromFormat(
      '!' + platform.getTimeFormatString(),
      value
    );
    if (!dateTime) {
      throw ConversionException.conversionFailedFormat(
        value,
        this.getName(),
        platform.getTimeFormatString()
      );
    }
    return dateTime;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return true;
  }
}
