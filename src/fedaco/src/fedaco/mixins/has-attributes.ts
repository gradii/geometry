/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { reflector } from '@gradii/annotation';
import { isArray, isBlank, isFunction, isNumber, isString } from '@gradii/check-type';
import { format, parse } from 'date-fns';
import { findLast, tap, uniq } from 'ramda';
import {
  Column, ColumnDefine, DateCastableColumn, DateColumn, EncryptedCastableColumn
} from '../../annotation/column';
import { Constructor } from '../../helper/constructor';
import { snakeCase } from '../../helper/str';
import { Encrypter } from '../encrypter';
import { Model } from '../model';
import { Relation } from '../relations/relation';

/*The built-in, primitive cast types supported by Eloquent.*/
const PrimitiveCastTypes: string[] = [
  'array', 'bool', 'boolean', 'collection', 'custom_datetime', 'date', 'datetime', 'decimal',
  'double', 'encrypted', 'encrypted:array', 'encrypted:collection', 'encrypted:json',
  'encrypted:object', 'float', 'immutable_date', 'immutable_datetime',
  'immutable_custom_datetime', 'int', 'integer', 'json', 'object', 'real', 'string', 'timestamp'
];

export interface HasAttributes {

}

type HasAttributesCtor = Constructor<HasAttributes>;

/** Mixin to augment a directive with a `disableRipple` property. */
export function mixinHasAttributes<T extends Constructor<{}>>(base: T): HasAttributesCtor & T {
  // @ts-ignore
  return class _Self extends base {
    /*The model's attributes.*/
    _attributes: any[] = [];
    /*The model attribute's original state.*/
    _original: any[] = [];
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
    public static snakeAttributes: boolean = true;
    /*The cache of the mutated attributes for each class.*/
    static mutatorCache: any[] = [];
    /*The encrypter instance that is used to encrypt attributes.*/
    public static encrypter: Encrypter;

    /*Convert the model's attributes to an array.*/

    constructor(...args: any[]) {
      super(...args);
    }

    /*Convert the model's attributes to an array.*/
    // public attributesToArray() {
    //   let attributes = this.getArrayableAttributes();
    //   attributes     = this.addDateAttributesToArray();
    //   attributes     = this.addMutatedAttributesToArray(attributes,
    //     mutatedAttributes = this.getMutatedAttributes());
    //   attributes     = this.addCastAttributesToArray(attributes, mutatedAttributes);
    //   for (let key of this.getArrayableAppends()) {
    //     attributes[key] = this.mutateAttributeForArray(key, null);
    //   }
    //   return attributes;
    // }

    /*Add the date attributes to the attributes array.*/
    protected addDateAttributesToArray(attributes: any[]) {
      for (let key of this.getDates()) {
        if (!(attributes[key] !== undefined)) {
          continue;
        }
        attributes[key] = this.serializeDate(this.asDateTime(attributes[key]));
      }
      return attributes;
    }

    // /*Add the mutated attributes to the attributes array.*/
    // protected addMutatedAttributesToArray(attributes: any[], mutatedAttributes: any[]) {
    //   for (let key of mutatedAttributes) {
    //     if (!array_key_exists(key, attributes)) {
    //       continue;
    //     }
    //     attributes[key] = this.mutateAttributeForArray(key, attributes[key]);
    //   }
    //   return attributes;
    // }

    /*Add the casted attributes to the attributes array.*/
    protected addCastAttributesToArray(this: Model & this, attributes: any,
                                       mutatedAttributes: any[]) {
      for (let [key, value] of Object.entries(this.getCasts())) {
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
          this.isCustomDateTimeCast(value) || this.isImmutableCustomDateTimeCast(value)
        )) {
          attributes[key] = attributes[key].format(value.split(':')[1]);
        }
        if (attributes[key] && attributes[key] instanceof Date && this.isClassCastable(key)) {
          attributes[key] = this.serializeDate(attributes[key]);
        }
        if (attributes[key] && this.isClassSerializable(key)) {
          attributes[key] = this.serializeClassCastableAttribute(key, attributes[key]);
        }
        // if (attributes[key] instanceof Arrayable) {
        //   attributes[key] = attributes[key].toArray();
        // }
      }
      return attributes;
    }

    /*Get an attribute array of all arrayable attributes.*/
    protected getArrayableAttributes() {
      return this.getArrayableItems(this.getAttributes());
    }

    /*Get all of the appendable values that are arrayable.*/
    protected getArrayableAppends() {
      if (!this._appends.length) {
        return [];
      }
      return this.getArrayableItems(array_combine(this.appends, this.appends));
    }

    /*Get the model's relationships in array form.*/
    public relationsToArray() {
      let attributes = [];
      for (let [key, value] of Object.entries(this.getArrayableRelations())) {
        if (value instanceof Arrayable) {
          let relation = value.toArray();
        } else if (isBlank(value)) {
          let relation = value;
        }
        if (HasAttributes.snakeAttributes) {
          let key = snakeCase(key);
        }
        if (relation !== undefined || isBlank(value)) {
          attributes[key] = relation;
        }
        delete relation;
      }
      return attributes;
    }

    /*Get an attribute array of all arrayable relations.*/
    protected getArrayableRelations() {
      return this.getArrayableItems(this.relations);
    }

    /*Get an attribute array of all arrayable values.*/
    protected getArrayableItems(values: any[]) {
      if (this.getVisible().length > 0) {
        values = array_intersect_key(values, array_flip(this.getVisible()));
      }
      if (this.getHidden().length > 0) {
        values = array_diff_key(values, array_flip(this.getHidden()));
      }
      return values;
    }

    /*Get an attribute from the model.*/
    public getAttribute(key: string) {
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
    public getAttributeValue(key: string) {
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
      if (!this.isRelation(key)) {
        return;
      }

      // if (this._preventsLazyLoading) {
      //   this.handleLazyLoadingViolation(key);
      // }
      return this.getRelationshipFromMethod(key);
    }

    /*Determine if the given key is a relationship method on the model.*/
    public isRelation(key: string) {
      const metadata = this._columnInfo(key);
      return metadata.isRelation || metadata.isRelationUsing;
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
    protected getRelationshipFromMethod(this: Model & this, method: string) {
      let relation = this[method]();
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
      }, relation.getResults());
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

    // /*Get the value of an attribute using its mutator for array conversion.*/
    // protected mutateAttributeForArray(key: string, value: any) {
    //   /*this.isClassCastable(key) ?
    //     this.getClassCastableAttributeValue(key, value) :*/
    //   return this.mutateAttribute(key, value);
    //   // return value instanceof Arrayable ? value.toArray() : value;
    // }

    /*Merge new casts with existing casts on the model.*/
    public mergeCasts(casts: any) {
      this._casts = {...this._casts, ...casts};
      return this;
    }

    /*Cast an attribute to a native PHP type.*/
    protected castAttribute(key: string, value: any) {
      let castType = this.getCastType(key);
      if (isBlank(value) && PrimitiveCastTypes.includes(castType)) {
        return value;
      }
      if (this.isEncryptedCastable(key)) {
        let value    = this.fromEncryptedString(value);
        let castType = castType.split('encrypted:').pop();
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
          return this.asDecimal(value, this.getCasts()[key].split(':')[1]);
        case 'string':
          return /*cast type string*/ value;
        case 'bool':
        case 'boolean':
          return /*cast type bool*/ value;
        case 'object':
          return this.fromJson(value, true);
        case 'array':
        case 'json':
          return this.fromJson(value);
        case 'collection':
          return new BaseCollection(this.fromJson(value));
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
    protected getCastType(key: string) {
      if (this.isCustomDateTimeCast(this.getCasts()[key])) {
        return 'custom_datetime';
      }
      if (this.isImmutableCustomDateTimeCast(this.getCasts()[key])) {
        return 'immutable_custom_datetime';
      }
      if (this.isDecimalCast(this.getCasts()[key])) {
        return 'decimal';
      }
      return trim(this.getCasts()[key].toLowerCase());
    }

    /*Increment or decrement the given attribute using the custom cast class.*/
    protected deviateClassCastableAttribute(method: string, key: string, value: any) {
      return this.resolveCasterClass(key)[method](this, key, value, this._attributes);
    }

    /*Serialize the given attribute using the custom cast class.*/
    protected serializeClassCastableAttribute(key: string, value: any) {
      return this.resolveCasterClass(key).serialize(this, key, value, this._attributes);
    }

    /*Determine if the cast type is a custom date time cast.*/
    protected isCustomDateTimeCast(cast: string) {
      const a = this._columnInfo(cast);
      return a && a.isDateCastable;

      // return str_starts_with(cast, 'date:') || str_starts_with(cast, 'datetime:');
    }

    /*Determine if the cast type is an immutable custom date time cast.*/
    protected isImmutableCustomDateTimeCast(cast: string) {
      return strncmp(cast, 'immutable_date:', 15) === 0 ||
        strncmp(cast, 'immutable_datetime:', 19) === 0;
    }

    /*Determine if the cast type is a decimal cast.*/
    protected isDecimalCast(cast: string) {
      return cast.startsWith('decimal:');
    }

    /*Set a given attribute on the model.*/
    public setAttribute(key: string, value: any) {
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
      return findLast(it => {
        return Column.isTypeOf(it) ||
          DateColumn.isTypeOf(it) ||
          DateCastableColumn.isTypeOf(it) ||
          EncryptedCastableColumn.isTypeOf(it);
      }, meta[key]) as ColumnDefine;
    }

    /*Determine if the given attribute is a date or date castable.*/
    protected isDateAttribute(key: string) {
      const a = this._columnInfo(key);

      return a && (a.isDate || a.isDateCastable);
      // return in_array(key, this.getDates(), true) || this.isDateCastable(key);
    }

    /*Set a given JSON attribute on the model.*/
    public fillJsonAttribute(key: string, value: any) {
      const [key, path]     = key.split('->');
      let value             = this.asJson(this.getArrayAttributeWithValue(path, key, value));
      this._attributes[key] = this.isEncryptedCastable(key) ? this.castAttributeAsEncryptedString(
        key, value) : value;
      return this;
    }

    /*Set the value of a class castable attribute.*/
    protected setClassCastableAttribute(key: string, value: any) {
      let caster       = this.resolveCasterClass(key);
      this._attributes = [
        ...this._attributes, ...this.normalizeCastClassResponse(key,
          caster.set(this, key, value, this._attributes))
      ];
      if (caster instanceof CastsInboundAttributes || !is_object(value)) {
        delete this._classCastCache[key];
      } else {
        this._classCastCache[key] = value;
      }
    }

    /*Get an array attribute with the given key and value set.*/
    protected getArrayAttributeWithValue(path: string, key: string, value: any) {
      return tap(array => {
        Arr.set(array, str_replace('->', '.', path), value);
      }, this.getArrayAttributeByKey(key));
    }

    /*Get an array attribute or return an empty array if it is not set.*/
    protected getArrayAttributeByKey(key: string) {
      if (!(this._attributes[key] !== undefined)) {
        return [];
      }
      return this.fromJson(this.isEncryptedCastable(key) ? this.fromEncryptedString(
        this._attributes[key]) : this._attributes[key]);
    }

    /*Cast the given attribute to JSON.*/
    protected castAttributeAsJson(key: string, value: any) {
      let value = this.asJson(value);
      if (value === false) {
        throw JsonEncodingException.forAttribute(this, key, json_last_error_msg());
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
      return number_format(value, decimals, '.', '');
    }

    /*Return a timestamp as DateTime object with time set to 00:00:00.*/
    protected asDate(value: any) {
      return this.asDateTime(value).startOfDay();
    }

    /*Return a timestamp as DateTime object.*/
    protected asDateTime(value: any) {
      if (value instanceof Date) {
        return value;
      }
      if (isNumber(value)) {
        return new Date(value * 1000);
      }
      if (this.isStandardDateFormat(value)) {
        return parse(value, 'yyyy-MM-dd', new Date());
      }
      let format = this.getDateFormat();
      let date;
      try {
        date = Date.createFromFormat(format, value);
      } catch (e: InvalidArgumentException) {
        date = false;
      }
      return date || Date.parse(value);
    }

    /*Determine if the given value is a standard date format.*/
    protected isStandardDateFormat(value: string) {
      return /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
    }

    /*Convert a DateTime to a storable string.*/
    public fromDateTime(value: any) {
      return !value.length ? value : this.asDateTime(value).format(this.getDateFormat());
    }

    /*Return a timestamp as unix timestamp.*/
    protected asTimestamp(value: any) {
      return this.asDateTime(value).getTimestamp();
    }

    /*Prepare a date for array / JSON serialization.*/
    protected serializeDate(date: Date) {
      return format(date, `yyyy-MM-dd'T'HH:mm:ssZ`);
    }

    /*Get the attributes that should be converted to dates.*/
    public getDates(this: Model & this) {
      if (!this.usesTimestamps()) {
        return this._dates;
      }
      let defaults = [this.getCreatedAtColumn(), this.getUpdatedAtColumn()];
      return uniq([...this._dates, ...defaults]);
    }

    /*Get the format for database stored dates.*/
    public getDateFormat() {
      return this.dateFormat || this.getConnection().getQueryGrammar().getDateFormat();
    }

    /*Set the date format used by the model.*/
    public setDateFormat(format: string) {
      this.dateFormat = format;
      return this;
    }

    /*Determine whether an attribute should be cast to a native type.*/
    public hasCast(key: string, types: any[] | string | null = null) {
      if (array_key_exists(key, this.getCasts())) {
        return types ? in_array(this.getCastType(key), /*cast type array*/ types, true) : true;
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
    protected isDateCastable(key: string) {
      return this.hasCast(key, ['date', 'datetime', 'immutable_date', 'immutable_datetime']);
    }

    /*Determine whether a value is JSON castable for inbound manipulation.*/
    protected isJsonCastable(key: string) {
      return this.hasCast(key, [
        'array', 'json', 'object', 'collection', 'encrypted:array', 'encrypted:collection',
        'encrypted:json', 'encrypted:object'
      ]);
    }

    /*Determine whether a value is an encrypted castable for inbound manipulation.*/
    protected isEncryptedCastable(key: string) {
      return this.hasCast(key, [
        'encrypted', 'encrypted:array', 'encrypted:collection', 'encrypted:json', 'encrypted:object'
      ]);
    }

    /*Determine if the given key is cast using a custom class.*/
    protected isClassCastable(this: Model & this, key: string) {
      if (!Object.keys(this.getCasts()).includes(key)) {
        return false;
      }

      let castType = this.getCasts()[key];
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

    /*Determine if the key is deviable using a custom class.*/
    protected isClassDeviable(key: string) {
      return this.isClassCastable(key) && method_exists(
        castType = this.parseCasterClass(this.getCasts()[key]), 'increment') && method_exists(
        castType, 'decrement');
    }

    /*Determine if the key is serializable using a custom class.*/
    protected isClassSerializable(key: string) {
      return this.isClassCastable(key) && method_exists(this.parseCasterClass(this.getCasts()[key]),
        'serialize');
    }

    /*Resolve the custom caster class for a given key.*/
    protected resolveCasterClass(key: string) {
      let castType  = this.getCasts()[key];
      let arguments = [];
      if (is_string(castType) && strpos(castType, ':') !== false) {
        let segments  = castType.split(':');
        let castType  = segments[0];
        let arguments = segments[1].split(',');
      }
      if (is_subclass_of(castType, Castable)) {
        let castType = castType.castUsing(arguments);
      }
      if (is_object(castType)) {
        return castType;
      }
      return new castType(());
    }

    // /*Parse the given caster class, removing any arguments.*/
    // protected parseCasterClass(clazz: string) {
    //   return strpos(clazz, ':') === false ? clazz : clazz.split(':')[0];
    // }

    /*Merge the cast class attributes back into the model.*/
    protected mergeAttributesFromClassCasts() {
      for (let [key, value] of Object.entries(this._classCastCache)) {
        let caster       = this.resolveCasterClass(key);
        this._attributes = [
          ...this._attributes,
          ...(caster instanceof CastsInboundAttributes ? {} : this.normalizeCastClassResponse(
            key, caster.set(this, key, value, this._attributes)))
        ];
      }
    }

    /*Normalize the response from a custom class caster.*/
    protected normalizeCastClassResponse(key: string, value: any) {
      return is_array(value) ? value : {};
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
    public setRawAttributes(attributes: any[], sync: boolean = false) {
      this._attributes = attributes;
      if (sync) {
        this.syncOriginal();
      }
      this._classCastCache = [];
      return this;
    }

    /*Get the model's original attribute values.*/
    public getOriginal(key: string | null = null, _default: any = null) {
      return new HasAttributes().setRawAttributes(this.original,
        sync = true).getOriginalWithoutRewindingModel(key, _default);
    }

    /*Get the model's original attribute values.*/
    protected getOriginalWithoutRewindingModel(key: string | null = null, _default: any = null) {
      if (key) {
        return this.transformModelValue(key, Arr.get(this.original, key, _default));
      }
      return collect(this.original).mapWithKeys((value, key: string | null) => {
        return {};
      }).all();
    }

    /*Get the model's raw original attribute values.*/
    public getRawOriginal(key: string | null = null, _default: any = null) {
      return Arr.get(this.original, key, _default);
    }

    /*Get a subset of the model's attributes.*/
    public only(attributes: any[] | any) {
      let results = [];
      for (let attribute of is_array(attributes) ? attributes : func_get_args()) {
        results[attribute] = this.getAttribute(attribute);
      }
      return results;
    }

    /*Sync the original attributes with the current.*/
    public syncOriginal() {
      this.original = this.getAttributes();
      return this;
    }

    /*Sync a single original attribute with its current value.*/
    public syncOriginalAttribute(attribute: string) {
      return this.syncOriginalAttributes(attribute);
    }

    /*Sync multiple original attribute with their current values.*/
    public syncOriginalAttributes(attributes: any[] | string) {
      let attributes      = is_array(attributes) ? attributes : func_get_args();
      let modelAttributes = this.getAttributes();
      for (let attribute of attributes) {
        this.original[attribute] = modelAttributes[attribute];
      }
      return this;
    }

    /*Sync the changed attributes.*/
    public syncChanges() {
      this.changes = this.getDirty();
      return this;
    }

    /*Determine if the model or any of the given attribute(s) have been modified.*/
    public isDirty(attributes: any[] | string | null = null) {
      return this.hasChanges(this.getDirty(), is_array(attributes) ? attributes : func_get_args());
    }

    /*Determine if the model or all the given attribute(s) have remained the same.*/
    public isClean(attributes: any[] | string | null = null) {
      return !this.isDirty(());
    }

    /*Determine if the model or any of the given attribute(s) have been modified.*/
    public wasChanged(attributes: any[] | string | null = null) {
      return this.hasChanges(this.getChanges(),
        isArray(attributes) ? attributes : func_get_args());
    }

    /*Determine if any of the given attributes were changed.*/
    protected hasChanges(changes: any[], attributes: any[] | string | null = null) {
      if (!attributes.length) {
        return changes.length > 0;
      }
      for (let attribute of Arr.wrap(attributes)) {
        if (array_key_exists(attribute, changes)) {
          return true;
        }
      }
      return false;
    }

    /*Get the attributes that have been changed since the last sync.*/
    public getDirty() {
      let dirty = [];
      for (let [key, value] of Object.entries(this.getAttributes())) {
        if (!this.originalIsEquivalent(key)) {
          dirty[key] = value;
        }
      }
      return dirty;
    }

    /*Get the attributes that were changed.*/
    public getChanges() {
      return this.changes;
    }

    /*Determine if the new and old values for a given key are equivalent.*/
    public originalIsEquivalent(key: string) {
      if (!array_key_exists(key, this.original)) {
        return false;
      }
      var attribute = Arr.get(this.attributes, key);
      var original  = Arr.get(this.original, key);
      if (attribute === original) {
        return true;
      } else if (isBlank(attribute)) {
        return false;
      } else if (this.isDateAttribute(key)) {
        return this.fromDateTime(attribute) === this.fromDateTime(original);
      } else if (this.hasCast(key, ['object', 'collection'])) {
        return this.castAttribute(key, attribute) == this.castAttribute(key, original);
      } else if (this.hasCast(key, ['real', 'float', 'double'])) {
        if (attribute === null && original !== null || attribute !== null && original === null) {
          return false;
        }
        return abs(this.castAttribute(key, attribute) - this.castAttribute(key,
          original)) < PHP_FLOAT_EPSILON * 4;
      } else if (this.hasCast(key, HasAttributes.primitiveCastTypes)) {
        return this.castAttribute(key, attribute) === this.castAttribute(key, original);
      }
      return is_numeric(attribute) && is_numeric(original) && strcmp(/*cast type string*/ attribute, /*cast type string*/
        original) === 0;
    }

    /*Transform a raw model value using mutators, casts, etc.*/
    protected transformModelValue(key: string, value: any) {
      if (this.hasGetMutator(key)) {
        return this.mutateAttribute(key, value);
      }
      if (this.hasCast(key)) {
        return this.castAttribute(key, value);
      }
      if (value !== null && in_array(key, this.getDates(), false)) {
        return this.asDateTime(value);
      }
      return value;
    }

    /*Append attributes to query when building a query.*/
    public append(attributes: any[] | string) {
      this._appends = array_unique(
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
      return in_array(attribute, this._appends);
    }

    /*Get the mutated attributes for a given instance.*/
    public getMutatedAttributes() {
      var clazz = HasAttributes;
      if (!(HasAttributes.mutatorCache[clazz] !== undefined)) {
        HasAttributes.cacheMutatedAttributes(clazz);
      }
      return HasAttributes.mutatorCache[clazz];
    }

    /*Extract and cache all the mutated attributes of a class.*/
    public static cacheMutatedAttributes(clazz: string) {
      HasAttributes.mutatorCache[clazz] = collect(HasAttributes.getMutatorMethods(clazz)).map(
        match => {
          return lcfirst(HasAttributes.snakeAttributes ? Str.snake(match) : match);
        }).all();
    }

    /*Get all of the attribute mutator methods.*/
    protected static getMutatorMethods(clazz: any) {
      preg_match_all('/(?<=^|;)get([^;]+?)Attribute(;|$)/', get_class_methods(clazz).join(';'),
        matches);
      return matches[1];
    }

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



