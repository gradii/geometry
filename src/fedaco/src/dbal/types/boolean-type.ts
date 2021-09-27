import { Type } from './Type';
import { Types } from './Types';
import { ParameterType } from '../ParameterType';

/*Type that maps an SQL boolean to a PHP boolean.*/
export class BooleanType extends Type {
  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getBooleanTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToDatabaseValue(value, platform) {
    return platform.convertBooleansToDatabaseValue(value);
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    return platform.convertFromBoolean(value);
  }

  /*{@inheritdoc}*/
  public getName() {
    return Types.BOOLEAN;
  }

  /*{@inheritdoc}*/
  public getBindingType() {
    return ParameterType.BOOLEAN;
  }
}
