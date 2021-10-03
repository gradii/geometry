/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { date_create_immutable, DateTimeImmutable } from 'ROOT';
import { VarDateTimeType } from './VarDateTimeType';
import { Types } from './Types';
import { ConversionException } from './ConversionException';

/*Immutable type of {@see VarDateTimeType}.*/
export class VarDateTimeImmutableType extends VarDateTimeType {
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
    const dateTime = date_create_immutable(value);
    if (!dateTime) {
      throw ConversionException.conversionFailed(value, this.getName());
    }
    return dateTime;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return true;
  }
}
