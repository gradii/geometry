/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { DBALException } from '../DBALException';

/*Conversion Exception is thrown when the database to PHP conversion fails.*/
export class ConversionException extends DBALException {
  /*Thrown when a Database to Doctrine Type Conversion fails.*/
  public static conversionFailed(
    value: string,
    toType: string,
    previous = null
  ) {
    let value = strlen(value) > 32 ? `${substr(value, 0, 20)}...` : value;
    return new ConversionException(
      `Could not convert database value "${value}" to Doctrine Type ${toType}`,
      0,
      previous
    );
  }

  /*Thrown when a Database to Doctrine Type Conversion fails and we can make a statement
      about the expected format.*/
  public static conversionFailedFormat(
    value: string,
    toType: string,
    expectedFormat: string,
    previous = null
  ) {
    let value = strlen(value) > 32 ? `${substr(value, 0, 20)}...` : value;
    return new ConversionException(
      `Could not convert database value "${value}" to Doctrine Type ${toType}. Expected format: ${expectedFormat}`,
      0,
      previous
    );
  }

  /*Thrown when the PHP value passed to the converter was not of the expected type.*/
  public static conversionFailedInvalidType(
    value: any,
    toType: string,
    possibleTypes: string[],
    previous = null
  ) {
    let actualType = is_object(value) ? get_class(value) : gettype(value);
    if (is_scalar(value)) {
      return new ConversionException(
        sprintf(
          `Could not convert PHP value '%s' of type '%s' to type '%s'. Expected one of the following types: %s`,
          value,
          actualType,
          toType,
          possibleTypes.join(', ')
        ),
        0,
        previous
      );
    }
    return new ConversionException(
      sprintf(
        `Could not convert PHP value of type '%s' to type '%s'. Expected one of the following types: %s`,
        actualType,
        toType,
        possibleTypes.join(', ')
      ),
      0,
      previous
    );
  }

  /**/
  public static conversionFailedSerialization(
    value: any,
    format: string,
    error: string
  ) {
    let actualType = is_object(value) ? get_class(value) : gettype(value);
    return new ConversionException(
      sprintf(
        `Could not convert PHP type '%s' to '%s', as an '%s' error was triggered by the serialization`,
        actualType,
        format,
        error
      )
    );
  }

  public static conversionFailedUnserialization(format, error) {
    return new ConversionException(
      sprintf(
        `Could not convert database value to '%s' as an error was triggered by the unserialization: '%s'`,
        format,
        error
      )
    );
  }
}
