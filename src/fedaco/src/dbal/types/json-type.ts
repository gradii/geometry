/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  is_resource,
  json_decode,
  json_encode,
  JSON_ERROR_NONE,
  json_last_error,
  json_last_error_msg,
  stream_get_contents
} from 'ROOT';

/*Type generating json objects values*/
export class JsonType extends Type {
  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getJsonTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    const encoded = json_encode(value);
    if (json_last_error() !== JSON_ERROR_NONE) {
      throw ConversionException.conversionFailedSerialization(
        value,
        'json',
        json_last_error_msg()
      );
    }
    return encoded;
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value === null || value === '') {
      return null;
    }
    if (is_resource(value)) {
      let value = stream_get_contents(value);
    }
    const val = json_decode(value, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
      throw ConversionException.conversionFailed(value, this.getName());
    }
    return val;
  }

  /*{@inheritdoc}*/
  public getName() {
    return Types.JSON;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return !platform.hasNativeJsonType();
  }
}
