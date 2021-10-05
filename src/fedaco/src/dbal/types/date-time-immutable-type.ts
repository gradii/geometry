/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DateTimeType } from './DateTimeType';
import { ConversionException } from './ConversionException';
import { Types } from './Types';

/*Immutable type of {@see DateTimeType}.*/
export class DateTimeImmutableType extends DateTimeType {
  /*{@inheritdoc}*/
  public getName() {
    return Types.DATETIME_IMMUTABLE;
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (value === null) {
      return value;
    }
    if (value instanceof DateTimeImmutable) {
      return value.format(platform.getDateTimeFormatString());
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
      platform.getDateTimeFormatString(),
      value
    );
    if (!dateTime) {
      dateTime = date_create_immutable(value);
    }
    if (!dateTime) {
      throw ConversionException.conversionFailedFormat(
        value,
        this.getName(),
        platform.getDateTimeFormatString()
      );
    }
    return dateTime;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return true;
  }
}
