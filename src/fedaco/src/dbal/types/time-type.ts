import { DateTime, DateTimeInterface } from 'ROOT';
import { ConversionException } from './ConversionException';
import { Types } from './Types';
import { Type } from './Type';

/*Type that maps an SQL TIME to a PHP DateTime object.*/
export class TimeType extends Type {
  /*{@inheritdoc}*/
  public getName() {
    return Types.TIME_MUTABLE;
  }

  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getTimeTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (value === null) {
      return value;
    }
    if (value instanceof DateTimeInterface) {
      return value.format(platform.getTimeFormatString());
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
    const val = DateTime.createFromFormat(
      '!' + platform.getTimeFormatString(),
      value
    );
    if (!val) {
      throw ConversionException.conversionFailedFormat(
        value,
        this.getName(),
        platform.getTimeFormatString()
      );
    }
    return val;
  }
}
