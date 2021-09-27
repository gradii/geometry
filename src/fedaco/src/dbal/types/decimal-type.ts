import { Type } from './Type';
import { Types } from './Types';

/*Type that maps an SQL DECIMAL to a PHP string.*/
export class DecimalType extends Type {
  /*{@inheritdoc}*/
  public getName() {
    return Types.DECIMAL;
  }

  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getDecimalTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    return value;
  }
}
