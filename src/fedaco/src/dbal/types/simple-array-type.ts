/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Type } from './Type';
import { Types } from './Types';

/*Array Type which can be used for simple values.

Only use this type if you are sure that your values cannot contain a ",".*/
export class SimpleArrayType extends Type {
  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getClobTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (!value) {
      return null;
    }
    return value.join(',');
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value === null) {
      return [];
    }
    let value = is_resource(value) ? stream_get_contents(value) : value;
    return value.split(',');
  }

  /*{@inheritdoc}*/
  public getName() {
    return Types.SIMPLE_ARRAY;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return true;
  }
}
