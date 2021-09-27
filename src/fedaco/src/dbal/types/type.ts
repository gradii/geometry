import { Types } from './Types';
import { TypeRegistry } from './TypeRegistry';
import { ParameterType } from '../ParameterType';
import { AbstractPlatform } from '../platforms/AbstractPlatform';
import { ArrayType } from './ArrayType';
import { BigIntType } from './BigIntType';
import { BinaryType } from './BinaryType';
import { BlobType } from './BlobType';
import { BooleanType } from './BooleanType';
import { DateType } from './DateType';
import { DateImmutableType } from './DateImmutableType';
import { DateIntervalType } from './DateIntervalType';
import { DateTimeType } from './DateTimeType';
import { DateTimeImmutableType } from './DateTimeImmutableType';
import { DateTimeTzType } from './DateTimeTzType';
import { DateTimeTzImmutableType } from './DateTimeTzImmutableType';
import { DecimalType } from './DecimalType';
import { FloatType } from './FloatType';
import { GuidType } from './GuidType';
import { IntegerType } from './IntegerType';
import { JsonType } from './JsonType';
import { JsonArrayType } from './JsonArrayType';
import { ObjectType } from './ObjectType';
import { SimpleArrayType } from './SimpleArrayType';
import { SmallIntType } from './SmallIntType';
import { StringType } from './StringType';
import { TextType } from './TextType';
import { TimeType } from './TimeType';
import { TimeImmutableType } from './TimeImmutableType';

/*The base class for so-called Doctrine mapping types.

A Type object is obtained by calling the static {@link getType()} method.*/
export abstract class Type {
  static BIGINT = Types.BIGINT;
  static BINARY = Types.BINARY;
  static BLOB = Types.BLOB;
  static BOOLEAN = Types.BOOLEAN;
  static DATE = Types.DATE_MUTABLE;
  static DATE_IMMUTABLE = Types.DATE_IMMUTABLE;
  static DATEINTERVAL = Types.DATEINTERVAL;
  static DATETIME = Types.DATETIME_MUTABLE;
  static DATETIME_IMMUTABLE = Types.DATETIME_IMMUTABLE;
  static DATETIMETZ = Types.DATETIMETZ_MUTABLE;
  static DATETIMETZ_IMMUTABLE = Types.DATETIMETZ_IMMUTABLE;
  static DECIMAL = Types.DECIMAL;
  static FLOAT = Types.FLOAT;
  static GUID = Types.GUID;
  static INTEGER = Types.INTEGER;
  static JSON = Types.JSON;
  static JSON_ARRAY = Types.JSON_ARRAY;
  static OBJECT = Types.OBJECT;
  static SIMPLE_ARRAY = Types.SIMPLE_ARRAY;
  static SMALLINT = Types.SMALLINT;
  static STRING = Types.STRING;
  static TARRAY = Types.ARRAY;
  static TEXT = Types.TEXT;
  static TIME = Types.TIME_MUTABLE;
  static TIME_IMMUTABLE = Types.TIME_IMMUTABLE;

  static BUILTIN_TYPES_MAP = {
    [Types.ARRAY]               : ArrayType,
    [Types.BIGINT]              : BigIntType,
    [Types.BINARY]              : BinaryType,
    [Types.BLOB]                : BlobType,
    [Types.BOOLEAN]             : BooleanType,
    [Types.DATE_MUTABLE]        : DateType,
    [Types.DATE_IMMUTABLE]      : DateImmutableType,
    [Types.DATEINTERVAL]        : DateIntervalType,
    [Types.DATETIME_MUTABLE]    : DateTimeType,
    [Types.DATETIME_IMMUTABLE]  : DateTimeImmutableType,
    [Types.DATETIMETZ_MUTABLE]  : DateTimeTzType,
    [Types.DATETIMETZ_IMMUTABLE]: DateTimeTzImmutableType,
    [Types.DECIMAL]             : DecimalType,
    [Types.FLOAT]               : FloatType,
    [Types.GUID]                : GuidType,
    [Types.INTEGER]             : IntegerType,
    [Types.JSON]                : JsonType,
    [Types.JSON_ARRAY]          : JsonArrayType,
    [Types.OBJECT]              : ObjectType,
    [Types.SIMPLE_ARRAY]        : SimpleArrayType,
    [Types.SMALLINT]            : SmallIntType,
    [Types.STRING]              : StringType,
    [Types.TEXT]                : TextType,
    [Types.TIME_MUTABLE]        : TimeType,
    [Types.TIME_IMMUTABLE]      : TimeImmutableType
  };
  private static typeRegistry: TypeRegistry | null;

  public constructor() {
  }

  /**/
  public static getTypeRegistry() {
    if (Type.typeRegistry === null) {
      Type.typeRegistry = Type.createTypeRegistry();
    }
    return Type.typeRegistry;
  }

  /*Factory method to create type instances.
      Type instances are implemented as flyweights.*/
  public static getType(name) {
    return Type.getTypeRegistry().get(name);
  }

  /*Adds a custom type to the type map.*/
  public static addType(name, className) {
    Type.getTypeRegistry().register(name, new className());
  }

  /*Checks if exists support for a type.*/
  public static hasType(name) {
    return Type.getTypeRegistry().has(name);
  }

  /*Overrides an already defined type to use a different implementation.*/
  public static overrideType(name: string, className: string) {
    Type.getTypeRegistry().override(name, new className());
  }

  /*Gets the types array map which holds all registered types and the corresponding
      type class*/
  public static getTypesMap() {
    return Object.values(Type.getTypeRegistry().getMap()).map((type) => {
      return type.constructor;
    });
  }

  private static createTypeRegistry() {
    var registry = new TypeRegistry();
    for (let [name, clazz] of Object.entries(Type.BUILTIN_TYPES_MAP)) {
      registry.register(name, new clazz());
    }
    return registry;
  }

  /*Converts a value from its PHP representation to its database representation
      of this type.*/
  public convertToDatabaseValue(value, platform) {
    return value;
  }

  /*Converts a value from its database representation to its PHP representation
      of this type.*/
  public convertToPHPValue(value, platform) {
    return value;
  }

  /*Gets the default length of this type.*/
  public getDefaultLength(platform) {
    return null;
  }

  /*Gets the SQL declaration snippet for a field of this type.*/
  public abstract getSQLDeclaration(fieldDeclaration, platform);

  /*Gets the name of this type.*/
  public abstract getName();

  /*Gets the (preferred) binding type for values of this type that
      can be used when binding parameters to prepared statements.

      This method should return one of the {@link \Doctrine\DBAL\ParameterType} constants.*/
  public getBindingType(): ParameterType | 'string' {
    return 'string';
  }

  /**/
  public __toString() {
    var type = Type;
    var position = strrpos(type, '\\');
    if (position !== false) {
      var type = substr(type, position);
    }
    return str_replace('Type', '', type);
  }

  /*Does working with this column require SQL conversion functions?

      This is a metadata function that is required for example in the ORM.
      Usage of {@link convertToDatabaseValueSQL} and
      {@link convertToPHPValueSQL} works for any type and mostly
      does nothing. This method can additionally be used for optimization purposes.*/
  public canRequireSQLConversion() {
    return false;
  }

  /*Modifies the SQL expression (identifier, parameter) to convert to a database value.*/
  public convertToDatabaseValueSQL(sqlExpr: string, platform) {
    return sqlExpr;
  }

  /*Modifies the SQL expression (identifier, parameter) to convert to a PHP value.*/
  public convertToPHPValueSQL(sqlExpr: string, platform: AbstractPlatform) {
    return sqlExpr;
  }

  /*Gets an array of database types that map to this Doctrine type.*/
  public getMappedDatabaseTypes(platform) {
    return [];
  }

  /*If this Doctrine Type maps to an already mapped database type,
      reverse schema engineering can't tell them apart. You need to mark
      one of those types as commented, which will have Doctrine use an SQL
      comment to typehint the actual Doctrine Type.*/
  public requiresSQLCommentHint(platform) {
    return false;
  }
}
