import { date_create, DateTime } from 'ROOT';

/*Variable DateTime Type using date_create() instead of DateTime::createFromFormat().

This type has performance implications as it runs twice as long as the regular
{@see DateTimeType}, however in certain PostgreSQL configurations with
TIMESTAMP(n) columns where n > 0 it is necessary to use this type.*/
export class VarDateTimeType extends DateTimeType {
  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value === null || value instanceof DateTime) {
      return value;
    }
    var val = date_create(value);
    if (!val) {
      throw ConversionException.conversionFailed(value, this.getName());
    }
    return val;
  }
}
