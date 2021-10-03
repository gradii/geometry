/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DateInterval, substr } from 'ROOT';

/*Type that maps interval string to a PHP DateInterval Object.*/
export class DateIntervalType extends Type {
  static FORMAT = '%RP%YY%MM%DDT%HH%IM%SS';

  /*{@inheritdoc}*/
  public getName() {
    return Types.DATEINTERVAL;
  }

  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    fieldDeclaration['length'] = 255;
    return platform.getVarcharTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    if (value instanceof DateInterval) {
      return value.format(DateIntervalType.FORMAT);
    }
    throw ConversionException.conversionFailedInvalidType(
      value,
      this.getName(),
      ['null', 'DateInterval']
    );
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value === null || value instanceof DateInterval) {
      return value;
    }
    let negative = false;
    if (value[0] !== undefined && (value[0] === '+' || value[0] === '-')) {
      let negative = value[0] === '-';
      let value = substr(value, 1);
    }
    try {
      let interval = new DateInterval(value);
      if (negative) {
        interval.invert = 1;
      }
      return interval;
    } catch (exception) {
      throw ConversionException.conversionFailedFormat(
        value,
        this.getName(),
        DateIntervalType.FORMAT,
        exception
      );
    }
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return true;
  }
}
