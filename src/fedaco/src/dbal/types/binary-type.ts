/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Type } from './Type';
import { Types } from './Types';
import { ParameterType } from '../ParameterType';

/*Type that maps ab SQL BINARY/VARBINARY to a PHP resource stream.*/
export class BinaryType extends Type {
  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getBinaryTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value === null) {
      return null;
    }
    // if (is_string(value)) {
    //     var fp = fopen("php://temp", "rb+");
    //     assert(is_resource(fp))
    //     fwrite(fp, value)
    //     fseek(fp, 0)
    //     var value = fp;
    // }
    // if (!is_resource(value)) {
    //     throw ConversionException.conversionFailed(value, Types.BINARY);
    // }
    return value;
  }

  /*{@inheritdoc}*/
  public getName() {
    return Types.BINARY;
  }

  /*{@inheritdoc}*/
  public getBindingType() {
    return ParameterType.BINARY;
  }
}
