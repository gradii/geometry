import {
  is_resource,
  restore_error_handler,
  serialize,
  set_error_handler,
  stream_get_contents,
  unserialize
} from 'ROOT';
import { Types } from './Types';
import { ConversionException } from './ConversionException';
import { Type } from './Type';

/*Type that maps a PHP object to a clob SQL type.*/
export class ObjectType extends Type {
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
    value = is_resource(value) ? stream_get_contents(value) : value;
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
    return Types.OBJECT;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return true;
  }
}
