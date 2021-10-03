/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Type } from './Type';
import { Types } from './Types';

/*Type that maps an SQL DATE to a PHP Date object.*/
export class DateType extends Type {
  /*{@inheritdoc}*/
  public getName() {
    return Types.DATE_MUTABLE;
  }

  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getDateTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (value === null) {
      return value;
    }
    if (value instanceof DateTimeInterface) {
      return value.format(platform.getDateFormatString());
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
      '!' + platform.getDateFormatString(),
      value
    );
    if (!val) {
      throw ConversionException.conversionFailedFormat(
        value,
        this.getName(),
        platform.getDateFormatString()
      );
    }
    return val;
  }
}
