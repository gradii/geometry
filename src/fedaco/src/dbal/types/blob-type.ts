import { Type } from './Type';
import { Types } from './Types';
import { ParameterType } from '../ParameterType';

/*Type that maps an SQL BLOB to a PHP resource stream.*/
export class BlobType extends Type {
  /*{@inheritdoc}*/
  public getSQLDeclaration(fieldDeclaration, platform) {
    return platform.getBlobTypeDeclarationSQL(fieldDeclaration);
  }

  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value === null) {
      return null;
    }
    // if (isString(value)) {
    //     var fp = fopen("php://temp", "rb+");
    //     assert(is_resource(fp))
    //     fwrite(fp, value)
    //     fseek(fp, 0)
    //     var value = fp;
    // }
    // if (!is_resource(value)) {
    //     throw ConversionException.conversionFailed(value, Types.BLOB);
    // }
    return value;
  }

  /*{@inheritdoc}*/
  public getName() {
    return Types.BLOB;
  }

  /*{@inheritdoc}*/
  public getBindingType() {
    return ParameterType.LARGE_OBJECT;
  }
}
