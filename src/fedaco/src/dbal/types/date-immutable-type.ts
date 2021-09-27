import { DateTimeImmutable } from 'ROOT';
import { Types } from './Types';
import { DateType } from './DateType';

/*Immutable type of {@see DateType}.*/
export class DateImmutableType extends DateType {
  /*{@inheritdoc}*/
  public getName() {
    return Types.DATE_IMMUTABLE;
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (value === null) {
      return value;
    }
    if (value instanceof DateTimeImmutable) {
      return value.format(platform.getDateFormatString());
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
      '!' + platform.getDateFormatString(),
      value
    );
    if (!dateTime) {
      throw ConversionException.conversionFailedFormat(
        value,
        this.getName(),
        platform.getDateFormatString()
      );
    }
    return dateTime;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return true;
  }
}
