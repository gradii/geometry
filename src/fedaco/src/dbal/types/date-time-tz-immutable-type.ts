import { DateTimeImmutable } from 'ROOT';
import { DateTimeTzType } from './DateTimeTzType';
import { Types } from './Types';
import { ConversionException } from './ConversionException';

/*Immutable type of {@see DateTimeTzType}.*/
export class DateTimeTzImmutableType extends DateTimeTzType {
  /*{@inheritdoc}*/
  public getName() {
    return Types.DATETIMETZ_IMMUTABLE;
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (value === null) {
      return value;
    }
    if (value instanceof DateTimeImmutable) {
      return value.format(platform.getDateTimeTzFormatString());
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
    var dateTime = DateTimeImmutable.createFromFormat(
      platform.getDateTimeTzFormatString(),
      value
    );
    if (!dateTime) {
      throw ConversionException.conversionFailedFormat(
        value,
        this.getName(),
        platform.getDateTimeTzFormatString()
      );
    }
    return dateTime;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return true;
  }
}
