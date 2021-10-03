/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Types } from './Types';
import { Type } from './Type';
import { ParameterType } from '../ParameterType';

/*Type that maps a database BIGINT to a PHP string.*/
export class BigIntType extends Type implements PhpIntegerMappingType {
  /*{@inheritdoc}*/
  public getName() {
    return Types.BIGINT;
  }

  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getBigIntTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public getBindingType() {
    return ParameterType.STRING;
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    return value === null
      ? null
      : // cast type string
      value;
  }
}
