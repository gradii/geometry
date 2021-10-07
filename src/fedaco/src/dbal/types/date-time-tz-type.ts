/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DateTime, DateTimeInterface } from 'ROOT';
import { Type } from './Type';
import { Types } from './Types';
import { ConversionException } from './ConversionException';
import { PhpDateTimeMappingType } from './PhpDateTimeMappingType';

/*DateTime type saving additional timezone information.

Caution: Databases are not necessarily experts at storing timezone related
data of dates. First, of all the supported vendors only PostgreSQL and Oracle
support storing Timezone data. But those two don't save the actual timezone
attached to a DateTime instance (for example "Europe/Berlin" or "America/Montreal")
but the current offset of them related to UTC. That means depending on daylight saving times
or not you may get different offsets.

This datatype makes only sense to use, if your application works with an offset, not
with an actual timezone that uses transitions. Otherwise your DateTime instance
attached with a timezone such as Europe/Berlin gets saved into the database with
the offset and re-created from persistence with only the offset, not the original timezone
attached.*/
export class DateTimeTzType extends Type implements PhpDateTimeMappingType {
  /*{@inheritdoc}*/
  public getName() {
    return Types.DATETIMETZ_MUTABLE;
  }

  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getDateTimeTzTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (value === null) {
      return value;
    }
    if (value instanceof DateTimeInterface) {
      return value.format(platform.getDateTimeTzFormatString());
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
      platform.getDateTimeTzFormatString(),
      value
    );
    if (!val) {
      throw ConversionException.conversionFailedFormat(
        value,
        this.getName(),
        platform.getDateTimeTzFormatString()
      );
    }
    return val;
  }
}