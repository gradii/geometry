/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Type } from './Type';
import { Types } from './Types';
import { PhpDateTimeMappingType } from './PhpDateTimeMappingType';

/*Type that maps an SQL DATETIME/TIMESTAMP to a PHP DateTime object.*/
export class DateTimeType extends Type implements PhpDateTimeMappingType {
  /*{@inheritdoc}*/
  public getName() {
    return Types.DATETIME_MUTABLE;
  }

  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getDateTimeTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (value === null) {
      return value;
    }
    if (value instanceof DateTimeInterface) {
      return value.format(platform.getDateTimeFormatString());
    }
    throw ConversionException.conversionFailedInvalidType(
      value,
      this.getName(),
      ['null', 'DateTime']
    );
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value === null || value instanceof DateTimeInterface) {
      return value;
    }
    let val = DateTime.createFromFormat(
      platform.getDateTimeFormatString(),
      value
    );
    if (!val) {
      let val = date_create(value);
    }
    if (!val) {
      throw ConversionException.conversionFailedFormat(
        value,
        this.getName(),
        platform.getDateTimeFormatString()
      );
    }
    return val;
  }
}
