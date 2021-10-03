/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Type } from './Type';
import { Types } from './Types';
import { AbstractPlatform } from '../platforms/AbstractPlatform';

/*Type that maps an SQL VARCHAR to a PHP string.*/
export class StringType extends Type {
  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform: AbstractPlatform) {
    return platform.getVarcharTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public getDefaultLength(platform) {
    return platform.getVarcharDefaultLength();
  }

  /*{@inheritdoc}*/
  public getName() {
    return Types.STRING;
  }
}
