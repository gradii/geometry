/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Type } from './Type';

/*Type that maps a PHP array to a clob SQL type.*/
export class ArrayType extends Type {
  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getClobTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    return serialize(value);
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value === null) {
      return null;
    }
    let value = is_resource(value) ? stream_get_contents(value) : value;
    set_error_handler((code, message) => {
      throw ConversionException.conversionFailedUnserialization(
        this.getName(),
        message
      );
    });
    try {
      return unserialize(value);
    } finally {
      restore_error_handler();
    }
  }

  /*{@inheritdoc}*/
  public getName() {
    return Types.ARRAY;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return true;
  }
}
