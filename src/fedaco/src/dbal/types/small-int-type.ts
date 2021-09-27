import { Type } from './Type';
import { Types } from './Types';
import { ParameterType } from '../ParameterType';
import { PhpIntegerMappingType } from './PhpIntegerMappingType';

/*Type that maps a database SMALLINT to a PHP integer.*/
export class SmallIntType extends Type implements PhpIntegerMappingType {
  /*{@inheritdoc}*/
  public getName() {
    return Types.SMALLINT;
  }

  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getSmallIntTypeDeclarationSQL(fieldDeclaration);
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
