/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { reflector } from '@gradii/annotation';
import {
  isArray, isBlank, isFunction, isNumber, isObjectEmpty, isString
} from '@gradii/check-type';
import { format, getUnixTime, isValid, parse, startOfDay } from 'date-fns';
import { difference, equals, findLast, intersection, tap, uniq } from 'ramda';
import { ColumnAnnotation, FedacoColumn } from '../../annotation/column';
import { RelationColumnAnnotation } from '../../annotation/relation-column';
import { wrap } from '../../helper/arr';
import { Constructor } from '../../helper/constructor';
import { get, set } from '../../helper/obj';
import { Encrypter } from '../encrypter';
import { Model } from '../model';
import { Relation } from '../relations/relation';

const EPSILON = 0.000001;

/*The built-in, primitive cast types supported by Eloquent.*/
const PrimitiveCastTypes: string[] = [
  'array', 'bool', 'boolean', 'collection', 'custom_datetime', 'date', 'datetime', 'decimal',
  'double', 'encrypted', 'encrypted:array', 'encrypted:collection', 'encrypted:json',
  'encrypted:object', 'float', 'immutable_date', 'immutable_datetime',
  'immutable_custom_datetime', 'int', 'integer', 'json', 'object', 'real', 'string', 'timestamp'
];

export interface HasAttributes {
  /*The model's attributes.*/
  _attributes: any;
  /*The model attribute's original state.*/
  _original: any;
  /*The changed model attributes.*/
  _changes: any[];
  /*The attributes that should be cast.*/
  _casts: { [key: string]: string };
  /*The attributes that have been cast using custom classes.*/
  _classCastCache: any[];

  /*The attributes that should be mutated to dates.*/
  _dates: any[];
  /*The storage format of the model's date columns.*/
  _dateFormat: string;
  /*The accessors to append to the model's array form.*/
  _appends: any[];

  attributesToArray(): any;

  /*Add the date attributes to the attributes array.*/
  addDateAttributesToArray(attributes: any[]): any;

  // /*Add the mutated attributes to the attributes array.*/
  // addMutatedAttributesToArray(attributes: any[], mutatedAttributes: any[]) {
  //   for (let key of mutatedAttributes) {
  //     if (!array_key_exists(key, attributes)) {
  //       continue;
  //     }
  //     attributes[key] = this.mutateAttributeForArray(key, attributes[key]);
  //   }
  //   return attributes;
  // }
  /*Add the casted attributes to the attributes array.*/
  addCastAttributesToArray(this: Model & this, attributes: any, mutatedAttributes: any[]);

  /*Get an attribute array of all arrayable attributes.*/
  getArrayableAttributes();

  /*Get all of the appendable values that are arrayable.*/
  getArrayableAppends();

  /*Get the model's relationships in array form.*/
  relationsToArray();

  /*Get an attribute array of all arrayable relations.*/
  getArrayableRelations();

  /*Get an attribute array of all arrayable values.*/
  getArrayableItems(values: string[]);

  /*Unset to delete a attribute from the model.*/
  unsetAttribute(key: string);

  /*Get an attribute from the model.*/
  getAttribute(key: string);

  /*Get a plain attribute (not a relationship).*/
  getAttributeValue(key: string);

  /*Get an attribute from the $attributes array.*/
  _getAttributeFromArray(key: string);

  /*Get a relationship.*/
  getRelationValue(this: Model & this, key: string);

  /*Determine if the given key is a relationship method on the model.*/
  isRelation(key: string);

  // /*Handle a lazy loading violation.*/
  // handleLazyLoadingViolation(key: string) {
  //   if (HasAttributes.lazyLoadingViolationCallback !== undefined) {
  //     return call_user_func(HasAttributes.lazyLoadingViolationCallback, this, key);
  //   }
  //   throw new LazyLoadingViolationException(this, key);
  // }
  /*Get a relationship value from a method.*/
  getRelationshipFromMethod(this: Model & this, metadata: any, method: string);

  // /*Determine if a get mutator exists for an attribute.*/
  // hasGetMutator(key: string) {
  //   return method_exists(this, 'get' + Str.studly(key) + 'Attribute');
  // }
  //
  // /*Get the value of an attribute using its mutator.*/
  // mutateAttribute(key: string, value: any) {
  //   return this['get' + Str.studly(key) + 'Attribute'](value);
  // }
  // /*Get the value of an attribute using its mutator for array conversion.*/
  // mutateAttributeForArray(key: string, value: any) {
  //   /*this.isClassCastable(key) ?
  //     this.getClassCastableAttributeValue(key, value) :*/
  //   return this.mutateAttribute(key, value);
  //   // return value instanceof Arrayable ? value.toArray() : value;
  // }
  /*Merge new casts with existing casts on the model.*/
  mergeCasts(casts: any);

  /*Cast an attribute to a native PHP type.*/
  castAttribute(this: Model & this, key: string, value: any);

  /*Get the type of cast for a model attribute.*/
  getCastType(this: Model & this, key: string);

  /*Determine if the cast type is a custom date time cast.*/
  isCustomDateTimeCast(cast: string);

  /*Determine if the cast type is an immutable custom date time cast.*/
  isImmutableCustomDateTimeCast(cast: string);

  /*Determine if the cast type is a decimal cast.*/
  isDecimalCast(cast: string);

  /*Set a given attribute on the model.*/
  setAttribute(this: Model & this, key: string, value: any);

  _columnInfo(key: string);

  /*Determine if the given attribute is a date or date castable.*/
  isDateAttribute(key: string);

  /*Set a given JSON attribute on the model.*/
  fillJsonAttribute(key: string, value: any);

  /*Set the value of a class castable attribute.*/
  setClassCastableAttribute(key: string, value: any);

  /*Get an array attribute with the given key and value set.*/
  getArrayAttributeWithValue(path: string, key: string, value: any);

  /*Get an array attribute or return an empty array if it is not set.*/
  getArrayAttributeByKey(key: string);

  /*Cast the given attribute to JSON.*/
  castAttributeAsJson(key: string, value: any);

  /*Encode the given value as JSON.*/
  asJson(value: any);

  /*Decode the given JSON back into an array or object.*/
  fromJson(value: string);

  /*Decode the given float.*/
  fromFloat(value: any);

  /*Return a decimal as string.*/
  asDecimal(value: number, decimals: number);

  /*Return a timestamp as DateTime object with time set to 00:00:00.*/
  asDate(value: any);

  /*Return a timestamp as DateTime object.*/
  asDateTime(value: any): Date;

  /*Determine if the given value is a standard date format.*/
  isStandardDateFormat(value: string);

  /*Convert a DateTime to a storable string.*/
  fromDateTime(value: any);

  /*Return a timestamp as unix timestamp.*/
  asTimestamp(value: any);

  /*Prepare a date for array / JSON serialization.*/
  serializeDate(date: Date);

  /**
   *
   * @deprecated use @DateColumn instead
   * Get the attributes that should be converted to dates.
   */
  getDates(this: Model & this);

  /*Get the format for database stored dates.*/
  getDateFormat(this: Model & this);

  /*Set the date format used by the model.*/
  setDateFormat(format: string);

  /**
   * @deprecated
   * Determine whether an attribute should be cast to a native type.
   */
  hasCast(this: Model & this, key: string, types?: any[] | string | null);

  /*Get the casts array.*/
  getCasts(this: Model & this): { [key: string]: string };

  /*Determine whether a value is Date / DateTime castable for inbound manipulation.*/
  isDateCastable(this: Model & this, key: string);

  /*Determine whether a value is JSON castable for inbound manipulation.*/
  isJsonCastable(this: Model & this, key: string);

  /*Determine whether a value is an encrypted castable for inbound manipulation.*/
  isEncryptedCastable(this: Model & this, key: string);

  /*Determine if the given key is cast using a custom class.*/
  isClassCastable(this: Model & this, key: string);

  /*Merge the cast class attributes back into the model.*/
  mergeAttributesFromClassCasts();

  /*Normalize the response from a custom class caster.*/
  normalizeCastClassResponse(key: string, value: any);

  /*Get all of the current attributes on the model.*/
  getAttributes();

  /*Get all of the current attributes on the model for an insert operation.*/
  getAttributesForInsert();

  /*Set the array of model attributes. No checking is done.*/
  setRawAttributes(attributes: any, sync?: boolean);

  /*Get the model's original attribute values.*/
  getOriginal(key?: string | null, _default?: any);

  /*Get the model's original attribute values.*/
  getOriginalWithoutRewindingModel(key?: string | null, _default?: any);

  /*Get the model's raw original attribute values.*/
  getRawOriginal(key?: string | null, _default?: any);

  /*Get a subset of the model's attributes.*/
  only(...attributes: any[]);

  only(attributes: any[] | any);

  /*Sync the original attributes with the current.*/
  syncOriginal();

  /*Sync a single original attribute with its current value.*/
  syncOriginalAttribute(attribute: string);

  /*Sync multiple original attribute with their current values.*/
  syncOriginalAttributes(attributes: any[] | string);

  /*Sync the changed attributes.*/
  syncChanges();

  /*Determine if the model or any of the given attribute(s) have been modified.*/
  isDirty(...args: string[]);

  isDirty(attributes?: any[] | string | null);

  /*Determine if the model or all the given attribute(s) have remained the same.*/
  isClean(...attributes: string[] | string[][]);

  /*Determine if the model or any of the given attribute(s) have been modified.*/
  wasChanged(attributes?: any[] | string | null);

  /*Determine if any of the given attributes were changed.*/
  hasChanges(changes: any[], attributes?: any[] | string | null);

  /*Get the attributes that have been changed since the last sync.*/
  getDirty();

  /*Get the attributes that were changed.*/
  getChanges();

  /*Determine if the new and old values for a given key are equivalent.*/
  originalIsEquivalent(key: string);

  /*Transform a raw model value using mutators, casts, etc.*/
  transformModelValue(this: Model & this, key: string, value: any);

  /*Append attributes to query when building a query.*/
  append(attributes: any[] | string);

  /*Set the accessors to append to model arrays.*/
  setAppends(appends: any[]);

  /*Return whether the accessor attribute has been appended.*/
  hasAppended(attribute: string);
}

type HasAttributesCtor = Constructor<HasAttributes>;

/** Mixin to augment a directive with a `disableRipple` property. */
export function mixinHasAttributes<T extends Constructor<{}>>(base: T): HasAttributesCtor & T {
  // @ts-ignore
  return class _Self extends base {
    /*The model's attributes.*/
    _attributes: any = {};
    /*The model attribute's original state.*/
    _original: any = {};
    /*The changed model attributes.*/
    _changes: any[] = [];
    /*The attributes that should be cast.*/
    _casts: { [key: string]: string } = {};
    /*The attributes that have been cast using custom classes.*/
    _classCastCache: any[] = [];

    /*The attributes that should be mutated to dates.*/
    _dates: any[] = [];
    /*The storage format of the model's date columns.*/
    _dateFormat: string;
    /*The accessors to append to the model's array form.*/
    _appends: any[] = [];
    /*Indicates whether attributes are snake cased on arrays.*/
    public static snakeAttributes = true;
    /*The cache of the mutated attributes for each class.*/
    static mutatorCache: any[] = [];
    /*The encrypter instance that is used to encrypt attributes.*/
    public static encrypter: Encrypter;

    /*Convert the model's attributes to an array.*/

    constructor(...args: any[]) {
      super(...args);
    }

    /*Convert the model's attributes to an array.*/
    public attributesToArray(this: Model & _Self) {
      let attributes          = this.getArrayableAttributes();
      attributes              = this.addDateAttributesToArray(attributes);
      const mutatedAttributes = this.getMutatedAttributes();
      attributes              = this.addMutatedAttributesToArray(attributes, mutatedAttributes);
      attributes              = this.addCastAttributesToArray(attributes, mutatedAttributes);
      for (let key of this.getArrayableAppends()) {
        attributes[key] = this.mutateAttributeForArray(key, null);
      }
      return attributes;
    }

    /*Add the date attributes to the attributes array.*/
    protected addDateAttributesToArray(this: Model & _Self, attributes: any[]) {
      for (const key of this.getDates()) {
        if (attributes[key] == undefined) {
          continue;
        }
        attributes[key] = this.serializeDate(this.asDateTime(attributes[key]));
      }
      return attributes;
    }

    /*Add the mutated attributes to the attributes array.*/
    protected addMutatedAttributesToArray(attributes: any[], mutatedAttributes: any[]) {
      for (let key of mutatedAttributes) {
        if (!(key in attributes)) {
          continue;
        }
        attributes[key] = this.mutateAttributeForArray(key, attributes[key]);
      }
      return attributes;
    }

    /*Add the casted attributes to the attributes array.*/
    protected addCastAttributesToArray(this: Model & this, attributes: any,
                                       mutatedAttributes: any[]) {
      for (const [key, value] of Object.entries(this.getCasts())) {
        if (!Object.keys(attributes).includes(key) || mutatedAttributes.includes(key)) {
          continue;
        }
        attributes[key] = this.castAttribute(key, attributes[key]);
        if (attributes[key] && [
          'date', 'datetime', 'immutable_date', 'immutable_datetime'
        ].includes(value)) {
          attributes[key] = this.serializeDate(attributes[key]);
        }
        if (attributes[key] && (
          this.isCustomDateTimeCast(value) ||
          this.isImmutableCustomDateTimeCast(value)
        )) {
          attributes[key] = attributes[key].format(value.split(':')[1]);
        }
        if (attributes[key] && attributes[key] instanceof Date && this.isClassCastable(key)) {
          attributes[key] = this.serializeDate(attributes[key]);
        }
        // if (attributes[key] && this.isClassSerializable(key)) {
        //   attributes[key] = this.serializeClassCastableAttribute(key, attributes[key]);
        // }
        // if (attributes[key] instanceof Arrayable) {
        //   attributes[key] = attributes[key].toArray();
        // }
      }
      return attributes;
    }

    /*Get an attribute array of all arrayable attributes.*/
    protected getArrayableAttributes(this: Model & _Self): Record<string, any> {
      return this.getArrayableItems(this.getAttributes());
    }

    /*Get all of the appendable values that are arrayable.*/
    protected getArrayableAppends(this: Model & _Self) {
      if (!this._appends.length) {
        return [];
      }
      return this.getArrayableItems(this._appends);
    }

    /*Get the model's relationships in array form.*/
    public relationsToArray(this: Model & _Self) {
      let attributes: any = {}, relation;
      for (const [key, value] of Object.entries(this.getArrayableRelations())) {
        if (isBlank(value)) {
          relation = value;
        }
        // if (HasAttributes.snakeAttributes) {
        // let key = snakeCase(key);
        // }
        if (relation !== undefined || isBlank(value)) {
          attributes[key] = relation;
        }
        // delete relation;
      }
      return attributes;
    }

    /*Get an attribute array of all arrayable relations.*/
    protected getArrayableRelations(this: Model & _Self) {
      return this.getArrayableItems(this._relations);
    }

    /*Get an attribute array of all arrayable values.*/
    protected getArrayableItems(this: Model & _Self, values: string[]): Record<string, any> {
      if (this.getVisible().length > 0) {
        values = intersection(values, this.getVisible());
      }
      if (this.getHidden().length > 0) {
        values = difference(values, this.getHidden());
      }
      return values;
    }

    public unsetAttribute(key: string) {
      delete this._attributes[key];
    }

    /*Get an attribute from the model.*/
    public getAttribute(this: Model & _Self, key: string) {
      if (!key) {
        return;
      }
      if (
        this._attributes.hasOwnProperty(key) ||
        this._casts.hasOwnProperty(key) ||
        // this.hasGetMutator(key) ||
        this.isClassCastable(key)
      ) {
        return this.getAttributeValue(key);
      }
      // if (method_exists(HasAttributes, key)) {
      //   return;
      // }
      return this.getRelationValue(key);
    }

    /*Get a plain attribute (not a relationship).*/
    public getAttributeValue(this: Model & _Self, key: string) {
      return this.transformModelValue(key, this._getAttributeFromArray(key));
    }

    /*Get an attribute from the $attributes array.*/
    _getAttributeFromArray(key: string) {
      return this.getAttributes()[key] ?? null;
    }

    /*Get a relationship.*/
    public getRelationValue(this: Model & this, key: string) {
      if (this.relationLoaded(key)) {
        return this._relations[key];
      }

      const relationMetadata = this.isRelation(key);
      if (!relationMetadata) {
        return;
      }

      // if (this._preventsLazyLoading) {
      //   this.handleLazyLoadingViolation(key);
      // }
      return this.getRelationshipFromMethod(relationMetadata, key);
    }

    /*Determine if the given key is a relationship method on the model.*/
    public isRelation(key: string) {
      const metadata   = this._columnInfo(key);
      const isRelation = metadata && (metadata.isRelation || metadata.isRelationUsing);
      if (isRelation) {
        return metadata;
      }
      return undefined;
      // return method_exists(this, key) ||
      //   (HasAttributes.relationResolvers[get_class(this)][key] ?? null);
    }

    // /*Handle a lazy loading violation.*/
    // protected handleLazyLoadingViolation(key: string) {
    //   if (HasAttributes.lazyLoadingViolationCallback !== undefined) {
    //     return call_user_func(HasAttributes.lazyLoadingViolationCallback, this, key);
    //   }
    //   throw new LazyLoadingViolationException(this, key);
    // }

    /*Get a relationship value from a method.*/
    protected async getRelationshipFromMethod(this: Model & this,
                                              metadata: RelationColumnAnnotation,
                                              method: string) {
      const relation = metadata._getRelation(this, method);
      if (!(relation instanceof Relation)) {
        if (isBlank(relation)) {
          throw new Error(
            'LogicException(`${HasAttributes}::${method} must return a relationship instance, but "null" was returned. Was the "return" keyword used?`');
        }
        throw new Error(
          'LogicException(`${HasAttributes}::${method} must return a relationship instance.`');
      }
      return tap(results => {
        this.setRelation(method, results);
      }, await relation.getResults());
    }

    // /*Determine if a get mutator exists for an attribute.*/
    // public hasGetMutator(key: string) {
    //   return method_exists(this, 'get' + Str.studly(key) + 'Attribute');
    // }
    //
    // /*Get the value of an attribute using its mutator.*/
    // protected mutateAttribute(key: string, value: any) {
    //   return this['get' + Str.studly(key) + 'Attribute'](value);
    // }

    /*Get the value of an attribute using its mutator for array conversion.*/
    protected mutateAttributeForArray(key: string, value: any) {
      this.isClassCastable(key) ?
        this.getClassCastableAttributeValue(key, value) :
        this.mutateAttribute(key, value);
      return value;
    }

    /*Merge new casts with existing casts on the model.*/
    public mergeCasts(casts: any) {
      this._casts = {...this._casts, ...casts};
      return this;
    }

    /*Cast an attribute to a native PHP type.*/
    protected castAttribute(this: Model & this, key: string, value: any) {
      let castType = this.getCastType(key);
      if (isBlank(value) && PrimitiveCastTypes.includes(castType)) {
        return value;
      }
      if (this.isEncryptedCastable(key)) {
        value    = this.fromEncryptedString(value);
        castType = castType.split('encrypted:').pop();
      }
      switch (castType) {
        case 'int':
        case 'integer':
          return /*cast type int*/ value;
        case 'real':
        case 'float':
        case 'double':
          return this.fromFloat(value);
        case 'decimal':
          return this.asDecimal(value, +this.getCasts()[key].split(':')[1]);
        case 'string':
          return /*cast type string*/ `${value}`;
        case 'bool':
        case 'boolean':
          return /*cast type bool*/ value && value !== 'false';
        case 'object':
          return this.fromJson(value);
        case 'array':
        case 'json':
          return this.fromJson(value);
        case 'collection':
          return this.fromJson(value);
        case 'date':
          return this.asDate(value);
        case 'datetime':
        case 'custom_datetime':
          return this.asDateTime(value);
        // case 'immutable_date':
        //   return this.asDate(value).toImmutable();
        // case 'immutable_custom_datetime':
        // case 'immutable_datetime':
        //   return this.asDateTime(value).toImmutable();
        case 'timestamp':
          return this.asTimestamp(value);
      }
      // if (this.isClassCastable(key)) {
      //   return this.getClassCastableAttributeValue(key, value);
      // }
      return value;
    }

    // /*Cast the given attribute using a custom cast class.*/
    // protected getClassCastableAttributeValue(key: string, value: any) {
    //   if (this._classCastCache[key] != undefined) {
    //     return this._classCastCache[key];
    //   } else {
    //     let caster = this.resolveCasterClass(key);
    //     let value  = caster instanceof CastsInboundAttributes ?
    //       value :
    //       caster.get(this, key, value, this.attributes);
    //     if (caster instanceof CastsInboundAttributes || !is_object(value)) {
    //       delete this._classCastCache[key];
    //     } else {
    //       this._classCastCache[key] = value;
    //     }
    //     return value;
    //   }
    // }

    /*Get the type of cast for a model attribute.*/
    protected getCastType(this: Model & this, key: string) {
      if (this.isCustomDateTimeCast(this.getCasts()[key])) {
        return 'custom_datetime';
      }
      if (this.isImmutableCustomDateTimeCast(this.getCasts()[key])) {
        return 'immutable_custom_datetime';
      }
      if (this.isDecimalCast(this.getCasts()[key])) {
        return 'decimal';
      }
      return this.getCasts()[key].toLowerCase().trim();
    }

    /*Increment or decrement the given attribute using the custom cast class.*/
    // protected deviateClassCastableAttribute(method: string, key: string, value: any) {
    //   return this.resolveCasterClass(key)[method](this, key, value, this._attributes);
    // }
    //
    // /*Serialize the given attribute using the custom cast class.*/
    // protected serializeClassCastableAttribute(key: string, value: any) {
    //   return this.resolveCasterClass(key).serialize(this, key, value, this._attributes);
    // }

    /*Determine if the cast type is a custom date time cast.*/
    protected isCustomDateTimeCast(cast: string) {
      const a = this._columnInfo(cast);
      return a && a.isDateCastable;

      // return str_starts_with(cast, 'date:') || str_starts_with(cast, 'datetime:');
    }

    /*Determine if the cast type is an immutable custom date time cast.*/
    protected isImmutableCustomDateTimeCast(cast: string) {
      return cast.startsWith('immutable_date:') ||
        cast.startsWith('immutable_datetime:');
    }

    /*Determine if the cast type is a decimal cast.*/
    protected isDecimalCast(cast: string) {
      return cast.startsWith('decimal:');
    }

    /*Set a given attribute on the model.*/
    public setAttribute(this: Model & this, key: string, value: any) {
      /*if (this.hasSetMutator(key)) {
        return this.setMutatedAttributeValue(key, value);
      } else */
      if (value && this.isDateAttribute(key)) {
        value = this.fromDateTime(value);
      }
      if (this.isClassCastable(key)) {
        this.setClassCastableAttribute(key, value);
        return this;
      }
      if (!isBlank(value) && this.isJsonCastable(key)) {
        value = this.castAttributeAsJson(key, value);
      }
      if (key.includes('->')) {
        return this.fillJsonAttribute(key, value);
      }
      if (!isBlank(value) && this.isEncryptedCastable(key)) {
        value = this.castAttributeAsEncryptedString(key, value);
      }
      this._attributes[key] = value;
      return this;
    }

    // /*Determine if a set mutator exists for an attribute.*/
    // public hasSetMutator(key: string) {
    //   return method_exists(this, 'set' + Str.studly(key) + 'Attribute');
    // }

    // /*Set the value of an attribute using its mutator.*/
    // protected setMutatedAttributeValue(key: string, value: any) {
    //   return this['set' + Str.studly(key) + 'Attribute'](value);
    // }

    protected _columnInfo(key: string) {
      const typeOfClazz = this.constructor as typeof Model;
      const meta        = reflector.propMetadata(typeOfClazz);
      if (meta[key] && isArray(meta[key])) {
        return findLast(it => {
          return FedacoColumn.isTypeMe(it);
        }, meta[key]) as ColumnAnnotation;
      }
      return undefined;
    }

    /*Determine if the given attribute is a date or date castable.*/
    protected isDateAttribute(this: Model & this, key: string) {
      const a = this._columnInfo(key);

      return a && (a.isDate || a.isDateCastable) || this.isDateCastable(key);
      // return in_array(key, this.getDates(), true) || this.isDateCastable(key);
    }

    /*Set a given JSON attribute on the model.*/
    public fillJsonAttribute(key: string, value: any) {
      let path;
      [key, path]           = key.split('->');
      value                 = this.asJson(this.getArrayAttributeWithValue(path, key, value));
      this._attributes[key] = /*this.isEncryptedCastable(key) ?
        this.castAttributeAsEncryptedString(key, value) :*/ value;
      return this;
    }

    /*Set the value of a class castable attribute.*/
    protected setClassCastableAttribute(key: string, value: any) {
      // let caster       = this.resolveCasterClass(key);
      this._attributes = [
        ...this._attributes, /*...this.normalizeCastClassResponse(key,
          caster.set(this, key, value, this._attributes))*/
      ];
      // if (caster instanceof CastsInboundAttributes || !isObject(value)) {
      //   delete this._classCastCache[key];
      // } else {
      //   this._classCastCache[key] = value;
      // }
    }

    /*Get an array attribute with the given key and value set.*/
    protected getArrayAttributeWithValue(path: string, key: string, value: any) {
      return tap(target => {
        set(target, path.replace('->', '.'), value);
      }, this.getArrayAttributeByKey(key));
    }

    /*Get an array attribute or return an empty array if it is not set.*/
    protected getArrayAttributeByKey(key: string) {
      if (!(this._attributes[key] !== undefined)) {
        return [];
      }
      // todo encrypted
      return this.fromJson(/*this.isEncryptedCastable(key) ? this.fromEncryptedString(
        this._attributes[key]) : */this._attributes[key]);
    }

    /*Cast the given attribute to JSON.*/
    protected castAttributeAsJson(key: string, value: any) {
      value = this.asJson(value);
      if (value === false) {
        throw new Error('JsonEncodingException.forAttribute(this, key, json_last_error_msg())');
      }
      return value;
    }

    /*Encode the given value as JSON.*/
    protected asJson(value: any) {
      return JSON.stringify(value);
    }

    /*Decode the given JSON back into an array or object.*/
    public fromJson(value: string) {
      return JSON.parse(value);
    }

    // /*Decrypt the given encrypted string.*/
    // public fromEncryptedString(value: string) {
    //   return (HasAttributes.encrypter ?? Crypt.getFacadeRoot()).decrypt(value, false);
    // }
    //
    // /*Cast the given attribute to an encrypted string.*/
    // protected castAttributeAsEncryptedString(key: string, value: any) {
    //   return (HasAttributes.encrypter ?? Crypt.getFacadeRoot()).encrypt(value, false);
    // }
    //
    // /*Set the encrypter instance that will be used to encrypt attributes.*/
    // public static encryptUsing(encrypter: Encrypter) {
    //   HasAttributes.encrypter = encrypter;
    // }

    /*Decode the given float.*/
    public fromFloat(value: any) {
      switch ( /*cast type string*/value) {
        case 'Infinity':
          return Infinity;
        case '-Infinity':
          return -Infinity;
        case 'NaN':
          return NaN;
        default:
          return /*cast type float*/ value;
      }
    }

    /*Return a decimal as string.*/
    protected asDecimal(value: number, decimals: number) {
      return value.toFixed(decimals);
    }

    /*Return a timestamp as DateTime object with time set to 00:00:00.*/
    protected asDate(this: Model & _Self, value: any): Date {
      return startOfDay(this.asDateTime(value));
    }

    /*Return a timestamp as DateTime object.*/
    protected asDateTime(this: Model & _Self, value: any): Date {
      if (value instanceof Date) {
        return value;
      }
      if (isNumber(value)) {
        return new Date(value * 1000);
      }
      if (this.isStandardDateFormat(value)) {
        return parse(value, 'yyyy-MM-dd', new Date());
      }
      let date;
      try {
        date = parse(value, this.getDateFormat() || 'yyyy-MM-dd HH:mm:ss', new Date(value));
      } catch (e) {
      }
      return isValid(date) ? date : new Date(value);
    }

    /*Determine if the given value is a standard date format.*/
    protected isStandardDateFormat(value: string) {
      return /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
    }

    /*Convert a DateTime to a storable string.*/
    public fromDateTime(this: Model & _Self, value: any) {
      return isBlank(value) ?
        value :
        format(this.asDateTime(value), this.getDateFormat());
    }

    /*Return a timestamp as unix timestamp.*/
    protected asTimestamp(this: Model & _Self, value: any) {
      return getUnixTime(+this.asDateTime(value));
    }

    /*Prepare a date for array / JSON serialization.*/
    protected serializeDate(date: Date) {
      return format(date, `yyyy-MM-dd HH:mm:ss`);
    }

    /*Get the attributes that should be converted to dates.*/
    public getDates(this: Model & this) {
      if (!this.usesTimestamps()) {
        return this._dates;
      }
      const defaults = [this.getCreatedAtColumn(), this.getUpdatedAtColumn()];
      return uniq([...this._dates, ...defaults]);
    }

    /*Get the format for database stored dates.*/
    public getDateFormat(this: Model & this) {
      return this._dateFormat || this.getConnection().getQueryGrammar().getDateFormat();
    }

    /*Set the date format used by the model.*/
    public setDateFormat(format: string) {
      this._dateFormat = format;
      return this;
    }

    /*Determine whether an attribute should be cast to a native type.*/
    public hasCast(this: Model & this, key: string, types: any[] | string | null = null) {
      if (key in this.getCasts()) {
        return types ? types.includes(this.getCastType(key)) : true;
      }
      return false;
    }

    /*Get the casts array.*/
    public getCasts(this: Model & this) {
      if (this.getIncrementing()) {
        return {[this.getKeyName()]: this.getKeyType(), ...this._casts};
      }
      return this._casts;
    }

    /*Determine whether a value is Date / DateTime castable for inbound manipulation.*/
    protected isDateCastable(this: Model & this, key: string) {
      return this.hasCast(key, ['date', 'datetime', 'immutable_date', 'immutable_datetime']);
    }

    /*Determine whether a value is JSON castable for inbound manipulation.*/
    protected isJsonCastable(this: Model & this, key: string) {
      return this.hasCast(key, [
        'array', 'json', 'object', 'collection', 'encrypted:array', 'encrypted:collection',
        'encrypted:json', 'encrypted:object'
      ]);
    }

    /*Determine whether a value is an encrypted castable for inbound manipulation.*/
    protected isEncryptedCastable(this: Model & this, key: string) {
      return this.hasCast(key, [
        'encrypted', 'encrypted:array', 'encrypted:collection', 'encrypted:json', 'encrypted:object'
      ]);
    }

    /*Determine if the given key is cast using a custom class.*/
    protected isClassCastable(this: Model & this, key: string) {
      if (!Object.keys(this.getCasts()).includes(key)) {
        return false;
      }

      const castType = this.getCasts()[key];
      if (isString(castType) && PrimitiveCastTypes.includes(castType)) {
        return false;
      }
      if (isFunction(castType)) {
        return true;
      }
      // if (class_exists(castType)) {
      //   return true;
      // }
      throw new Error(`InvalidCastException(this.getModel(), key, castType)`);
    }

    // /*Determine if the key is deviable using a custom class.*/
    // protected isClassDeviable(key: string) {
    //   return this.isClassCastable(key) && method_exists(
    //     castType = this.parseCasterClass(this.getCasts()[key]), 'increment') && method_exists(
    //       castType, 'decrement');
    // }

    // /*Determine if the key is serializable using a custom class.*/
    // protected isClassSerializable(key: string) {
    //   return this.isClassCastable(key) && method_exists(this.parseCasterClass(this.getCasts()[key]),
    //     'serialize');
    // }

    /*Resolve the custom caster class for a given key.*/
    // protected resolveCasterClass(key: string) {
    //   let castType = this.getCasts()[key];
    //   let arguments = [];
    //   if (is_string(castType) && strpos(castType, ':') !== false) {
    //     let segments = castType.split(':');
    //     let castType = segments[0];
    //     let arguments = segments[1].split(',');
    //   }
    //   if (is_subclass_of(castType, Castable)) {
    //     let castType = castType.castUsing(arguments);
    //   }
    //   if (is_object(castType)) {
    //     return castType;
    //   }
    //   return new castType(());
    // }

    // /*Parse the given caster class, removing any arguments.*/
    // protected parseCasterClass(clazz: string) {
    //   return strpos(clazz, ':') === false ? clazz : clazz.split(':')[0];
    // }

    /*Merge the cast class attributes back into the model.*/
    protected mergeAttributesFromClassCasts() {
      for (const [key, value] of Object.entries(this._classCastCache)) {
        // let caster = this.resolveCasterClass(key);
        this._attributes = {
          ...this._attributes,
          // ...(
          // caster instanceof CastsInboundAttributes ? {} :
          // this.normalizeCastClassResponse(key, caster.set(this, key, value, this._attributes)
          // )
          // )
        };
      }
    }

    /*Normalize the response from a custom class caster.*/
    protected normalizeCastClassResponse(key: string, value: any) {
      return isArray(value) ? value : {};
    }

    /*Get all of the current attributes on the model.*/
    public getAttributes() {
      this.mergeAttributesFromClassCasts();
      return this._attributes;
    }

    /*Get all of the current attributes on the model for an insert operation.*/
    protected getAttributesForInsert() {
      return this.getAttributes();
    }

    /*Set the array of model attributes. No checking is done.*/
    public setRawAttributes(attributes: Record<string, any>, sync = false) {
      this._attributes = attributes;
      if (sync) {
        this.syncOriginal();
      }
      this._classCastCache = [];
      return this;
    }

    /*Get the model's original attribute values.*/
    public getOriginal(this: Model & _Self, key: string | null = null, _default: any = null) {
      // @ts-ignore
      return (new this.constructor())
        .setRawAttributes(this._original, true)
        .getOriginalWithoutRewindingModel(key, _default);
    }

    /*Get the model's original attribute values.*/
    protected getOriginalWithoutRewindingModel(this: Model & _Self,
                                               key: string | null = null,
                                               _default: any      = null) {
      if (key) {
        return this.transformModelValue(key, get(this._original, key, _default));
      }
      const results: any = {};
      for (const [_key, value] of Object.entries(this._original)) {
        results[_key] = this.transformModelValue(_key, value);
      }
      return results;
    }

    /*Get the model's raw original attribute values.*/
    public getRawOriginal(key: string | null = null, _default: any = null) {
      return get(this._original, key, _default);
    }

    /*Get a subset of the model's attributes.*/
    public only(this: Model & _Self, ...attributes: any[]);
    public only(this: Model & _Self, attributes: any[] | any) {
      const results: any = {};
      for (const attribute of isArray(attributes) ? attributes : arguments) {
        results[attribute] = this.getAttribute(attribute);
      }
      return results;
    }

    /*Sync the original attributes with the current.*/
    public syncOriginal() {
      // todo remove spread
      this._original = {...this.getAttributes()};
      return this;
    }

    /*Sync a single original attribute with its current value.*/
    public syncOriginalAttribute(attribute: string) {
      return this.syncOriginalAttributes(attribute);
    }

    /*Sync multiple original attribute with their current values.*/
    public syncOriginalAttributes(attributes: any[] | string) {
      attributes            = isArray(attributes) ? attributes : arguments as unknown as any[];
      const modelAttributes = this.getAttributes();
      for (const attribute of attributes) {
        this._original[attribute] = modelAttributes[attribute];
      }
      return this;
    }

    /*Sync the changed attributes.*/
    public syncChanges(this: Model & _Self) {
      this._changes = this.getDirty();
      return this;
    }

    public isDirty(this: Model & _Self, ...args: string[]);
    /*Determine if the model or any of the given attribute(s) have been modified.*/
    public isDirty(this: Model & _Self, attributes: any[] | string | null = null) {
      return this.hasChanges(this.getDirty(),
        isArray(attributes) ? attributes : [...arguments] as unknown as any[]);
    }

    /*Determine if the model or all the given attribute(s) have remained the same.*/
    public isClean(this: Model & _Self, ...attributes: string[] | string[][]) {
      return !this.isDirty(...attributes);
    }

    /*Determine if the model or any of the given attribute(s) have been modified.*/
    public wasChanged(this: Model & _Self, attributes: any[] | string | null = null) {
      return this.hasChanges(this.getChanges(),
        isArray(attributes) ? attributes : [...arguments] as unknown as any[]);
    }

    /*Determine if any of the given attributes were changed.*/
    protected hasChanges(this: Model & _Self, changes: any[],
                         attributes: any[] | string | null = null) {
      if (!attributes.length) {
        return !isObjectEmpty(changes);
      }
      for (const attribute of wrap(attributes)) {
        if (attribute in changes) {
          return true;
        }
      }
      return false;
    }

    /*Get the attributes that have been changed since the last sync.*/
    public getDirty(this: Model & _Self) {
      const dirty: any = {};
      for (const [key, value] of Object.entries(this.getAttributes())) {
        if (!this.originalIsEquivalent(key)) {
          dirty[key] = value;
        }
      }
      return dirty;
    }

    /*Get the attributes that were changed.*/
    public getChanges() {
      return this._changes;
    }

    /*Determine if the new and old values for a given key are equivalent.*/
    public originalIsEquivalent(this: Model & _Self, key: string) {
      if (!(key in this._original)) {
        return false;
      }
      const attribute = get(this._attributes, key);
      const original  = get(this._original, key);
      if (attribute === original) {
        return true;
      } else if (isBlank(attribute)) {
        return false;
      } else if (this.isDateAttribute(key)) {
        return this.fromDateTime(attribute) === this.fromDateTime(original);
      } else if (this.hasCast(key, ['object', 'collection'])) {
        return equals(this.castAttribute(key, attribute), this.castAttribute(key, original));
      } else if (this.hasCast(key, ['real', 'float', 'double'])) {
        if (attribute === null && original !== null || attribute !== null && original === null) {
          return false;
        }
        return Math.abs(this.castAttribute(key, attribute) - this.castAttribute(key,
          original)) < EPSILON * 4;
      } else if (this.hasCast(key, PrimitiveCastTypes)) {
        return this.castAttribute(key, attribute) === this.castAttribute(key, original);
      }
      return isNumber(attribute) &&
        isNumber(original) && attribute === original;
    }

    /*Transform a raw model value using mutators, casts, etc.*/
    protected transformModelValue(this: Model & this, key: string, value: any) {
      // if (this.hasGetMutator(key)) {
      //   return this.mutateAttribute(key, value);
      // }
      if (this.hasCast(key)) {
        return this.castAttribute(key, value);
      }
      if (value != null && this.getDates().includes(key)) {
        return this.asDateTime(value);
      }
      return value;
    }

    /*Append attributes to query when building a query.*/
    public append(attributes: any[] | string) {
      this._appends = uniq(
        [...this._appends, ...(isString(attributes) ? arguments : attributes)]);
      return this;
    }

    /*Set the accessors to append to model arrays.*/
    public setAppends(appends: any[]) {
      this._appends = appends;
      return this;
    }

    /*Return whether the accessor attribute has been appended.*/
    public hasAppended(attribute: string) {
      return attribute in this._appends;
    }

    // /*Get the mutated attributes for a given instance.*/
    // public getMutatedAttributes() {
    //   var clazz = HasAttributes;
    //   if (!(HasAttributes.mutatorCache[clazz] !== undefined)) {
    //     HasAttributes.cacheMutatedAttributes(clazz);
    //   }
    //   return HasAttributes.mutatorCache[clazz];
    // }

    // /*Extract and cache all the mutated attributes of a class.*/
    // public static cacheMutatedAttributes(clazz: string) {
    //   HasAttributes.mutatorCache[clazz] = collect(HasAttributes.getMutatorMethods(clazz)).map(
    //     match => {
    //       return lcfirst(HasAttributes.snakeAttributes ? Str.snake(match) : match);
    //     }).all();
    // }

    // /*Get all of the attribute mutator methods.*/
    // protected static getMutatorMethods(clazz: any) {
    //   preg_match_all('/(?<=^|;)get([^;]+?)Attribute(;|$)/', get_class_methods(clazz).join(';'),
    //     matches);
    //   return matches[1];
    // }

    // /*Get the mutated attributes for a given instance.*/
    // public getMutatedAttributes() {
    //   let clazz = HasAttributes;
    //   if (!(HasAttributes.mutatorCache[clazz] !== undefined)) {
    //     HasAttributes.cacheMutatedAttributes(clazz);
    //   }
    //   return HasAttributes.mutatorCache[clazz];
    // }

    // /*Extract and cache all the mutated attributes of a class.*/
    // public static cacheMutatedAttributes(clazz: string) {
    //   HasAttributes.mutatorCache[clazz] = collect(HasAttributes.getMutatorMethods(clazz)).map(
    //     match => {
    //       return lcfirst(HasAttributes.snakeAttributes ? Str.snake(match) : match);
    //     }).all();
    // }
    //
    // /*Get all of the attribute mutator methods.*/
    // protected static getMutatorMethods(clazz: any) {
    //   preg_match_all('/(?<=^|;)get([^;]+?)Attribute(;|$)/', get_class_methods(clazz).join(';'),
    //     matches);
    //   return matches[1];
    // }
  };
}



