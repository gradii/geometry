import { Types } from './Types';
import { Type } from './Type';
import { ParameterType } from '../ParameterType';
import { PhpIntegerMappingType } from './PhpIntegerMappingType';

/*Type that maps an SQL INT to a PHP integer.*/
export class IntegerType extends Type implements PhpIntegerMappingType {
  /*{@inheritdoc}*/
  public getName() {
    return Types.INTEGER;
  }

  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getIntegerTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    return value === null
      ? null
      : //cast type int
      value;
  }

  /*{@inheritdoc}*/
  public getBindingType() {
    return ParameterType.INTEGER;
  }
}
