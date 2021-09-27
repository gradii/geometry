import { Types } from './Types';
import { Type } from './Type';

export class FloatType extends Type {
  /*{@inheritdoc}*/
  public getName() {
    return Types.FLOAT;
  }

  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getFloatDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    return value === null
      ? null
      : //cast type float
      value;
  }
}
