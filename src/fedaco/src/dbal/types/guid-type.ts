/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { StringType } from './StringType';
import { Types } from './Types';

/*Represents a GUID/UUID datatype (both are actually synonyms) in the database.*/
export class GuidType extends StringType {
  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getGuidTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public getName() {
    return Types.GUID;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return !platform.hasNativeGuidType();
  }
}
