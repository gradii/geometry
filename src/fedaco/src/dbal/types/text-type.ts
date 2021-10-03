/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Type } from './Type';
import { Types } from './Types';
import { Stream } from 'stream';

/*Type that maps an SQL CLOB to a PHP string.*/
export class TextType extends Type {
  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getClobTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value instanceof Stream) {
      throw new Error('stream is not supported');
    }
    return value;
    // return is_resource(value) ? stream_get_contents(value) : value;
  }

  /*{@inheritdoc}*/
  public getName() {
    return Types.TEXT;
  }
}
