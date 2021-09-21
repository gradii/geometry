/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { tap } from 'ramda';
import { Constructor } from '../../helper/constructor';
import { snakeCase } from '../../helper/str';
import { MysqlGrammar } from '../../query-builder/grammar/mysql-grammar';
import { Processor } from '../../query-builder/processor';
import { QueryBuilder } from '../../query-builder/query-builder';
import { Model } from '../model';
import { Relation } from '../relations/relation';

export interface HasRelationships {
  _relations: any;

  // /*Define a one-to-one relationship.*/
  // hasOne(this: Model & this, related: typeof Model, foreignKey?: string | null,
  //        localKey?: string | null): HasOne;
  //
  // /*Instantiate a new HasOne relationship.*/
  // _newHasOne(query: FedacoBuilder, parent: Model, foreignKey: string, localKey: string): HasOne;
  //
  // /*Define a has-one-through relationship.*/
  // hasOneThrough(this: Model & this, related: typeof Model, through: typeof Model,
  //               firstKey?: string | null, secondKey?: string | null, localKey?: string | null,
  //               secondLocalKey?: string | null): HasOneThrough;
  //
  // /*Instantiate a new HasOneThrough relationship.*/
  // _newHasOneThrough(query: FedacoBuilder, farParent: Model, throughParent: Model, firstKey: string,
  //                   secondKey: string, localKey: string, secondLocalKey: string): HasOneThrough;
  //
  // /*Define a polymorphic one-to-one relationship.*/
  // morphOne(this: Model & this, related: typeof Model, name: string, type?: string | null,
  //          id?: string | null, localKey?: string | null): MorphOne;
  //
  // /*Instantiate a new MorphOne relationship.*/
  // _newMorphOne(query: FedacoBuilder, parent: Model, type: string, id: string,
  //              localKey: string): MorphOne;
  //
  // /*Define an inverse one-to-one or many relationship.*/
  // belongsTo(this: Model & this, related: typeof Model, foreignKey?: string | null,
  //           ownerKey?: string | null, relation?: string): BelongsTo;
  //
  // /*Instantiate a new BelongsTo relationship.*/
  // _newBelongsTo(query: FedacoBuilder, child: Model, foreignKey: string, ownerKey: string,
  //               relation: string): BelongsTo;
  //
  // /*Define a polymorphic, inverse one-to-one or many relationship.*/
  // morphTo(this: Model & this, name: string, morphToClassMap?: {
  //   [key: string]: typeof Model;
  // }, type?: string | null, id?: string | null, ownerKey?: string | null): MorphTo;
  //
  // /*Define a polymorphic, inverse one-to-one or many relationship.*/
  // _morphEagerTo(this: Model & this, name: string, type: string, id: string,
  //               ownerKey: string): MorphTo;
  //
  // /*Define a polymorphic, inverse one-to-one or many relationship.*/
  // _morphInstanceTo(this: Model & this, target: typeof Model, name: string, type: string, id: string,
  //                  ownerKey: string): MorphTo;
  //
  // /*Instantiate a new MorphTo relationship.*/
  // _newMorphTo(query: FedacoBuilder, parent: Model, foreignKey: string, ownerKey: string,
  //             type: string, relation: string): MorphTo;
  //
  // // /*Retrieve the actual class name for a given morph class.*/
  // // static getActualClassNameForMorph(clazz: string) {
  // //   return Arr.get(Relation.morphMap() || [], clazz, clazz);
  // // }
  // // /*Guess the "belongs to" relationship name.*/
  // // _guessBelongsToRelation() {
  // //   const [one, two, caller] = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3);
  // //   return caller['function'];
  // // }
  // /*Define a one-to-many relationship.*/
  // hasMany(this: Model & this, related: typeof Model, foreignKey?: string | null,
  //         localKey?: string | null): HasMany;
  //
  // /*Instantiate a new HasMany relationship.*/
  // _newHasMany(query: FedacoBuilder, parent: Model, foreignKey: string, localKey: string): HasMany;
  //
  // /*Define a has-many-through relationship.*/
  // hasManyThrough(this: Model & this, related: typeof Model, through: typeof Model,
  //                firstKey?: string | null, secondKey?: string | null, localKey?: string | null,
  //                secondLocalKey?: string | null): HasManyThrough;
  //
  // /*Instantiate a new HasManyThrough relationship.*/
  // _newHasManyThrough(query: FedacoBuilder, farParent: Model, throughParent: Model, firstKey: string,
  //                    secondKey: string, localKey: string, secondLocalKey: string): HasManyThrough;
  //
  // /*Define a polymorphic one-to-many relationship.*/
  // morphMany(this: Model & this, related: typeof Model, name: string, type?: string | null,
  //           id?: string | null, localKey?: string | null): MorphMany;
  //
  // /*Instantiate a new MorphMany relationship.*/
  // _newMorphMany(query: FedacoBuilder, parent: Model, type: string, id: string,
  //               localKey: string): MorphMany;
  //
  // /*Define a many-to-many relationship.*/
  // belongsToMany(this: Model & this, related: typeof Model, table?: string | null,
  //               foreignPivotKey?: string | null, relatedPivotKey?: string | null,
  //               parentKey?: string | null, relatedKey?: string | null,
  //               relation?: string | null): BelongsToMany;
  //
  // /*Instantiate a new BelongsToMany relationship.*/
  // _newBelongsToMany(query: FedacoBuilder, parent: Model, table: string, foreignPivotKey: string,
  //                   relatedPivotKey: string, parentKey: string, relatedKey: string,
  //                   relationName?: string | null): BelongsToMany;
  //
  // /*Define a polymorphic many-to-many relationship.*/
  // morphToMany(this: Model & this, related: typeof Model, name: string, relationName: string,
  //             table?: string | null, foreignPivotKey?: string | null,
  //             relatedPivotKey?: string | null, parentKey?: string | null,
  //             relatedKey?: string | null, inverse?: boolean): MorphToMany;
  //
  // /*Instantiate a new MorphToMany relationship.*/
  // _newMorphToMany(query: FedacoBuilder, parent: Model, name: string, table: string,
  //                 foreignPivotKey: string, relatedPivotKey: string, parentKey: string,
  //                 relatedKey: string, relationName?: string | null, inverse?: boolean): MorphToMany;
  //
  // /*Define a polymorphic, inverse many-to-many relationship.*/
  // morphedByMany(this: Model & this, related: typeof Model, name: string, relationName: string,
  //               table?: string | null, foreignPivotKey?: string | null,
  //               relatedPivotKey?: string | null, parentKey?: string | null,
  //               relatedKey?: string | null): MorphToMany;

  /*Get the relationship name of the belongsToMany relationship.*/
  // _guessBelongsToManyRelation() {
  //   let caller = Arr.first(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS), trace => {
  //     return !in_array(trace['function'],
  //       [...HasRelationships.manyMethods, ...['guessBelongsToManyRelation']]);
  //   });
  //   return !isBlank(caller) ? caller['function'] : null;
  // }
  /*Get the joining table name for a many-to-many relation.*/
  joiningTable(related: typeof Model, instance?: Model | null): string;

  /*Get this model's half of the intermediate table name for belongsToMany relationships.*/
  joiningTableSegment(): string;

  /*Determine if the model touches a given relation.*/
  touches(relation: string);

  /*Touch the owning relations of the model.*/
  touchOwners();

  /*Get the polymorphic relationship columns.*/
  _getMorphs(name: string, type: string, id: string): string[];

  /*Get the class name for polymorphic relations.*/
  getMorphClass();

  /*Create a new model instance for a related model.*/
  _newRelatedInstance(this: Model & this, clazz: typeof Model);

  getRelationMethod(relation: string);

  /*Get all the loaded relations for the instance.*/
  getRelations();

  /*Get a specified relationship.*/
  getRelation(relation: string);

  /*Determine if the given relation is loaded.*/
  relationLoaded(key: string);

  /*Set the given relationship on the model.*/
  setRelation(relation: string, value: any): this;

  /*Unset a loaded relationship.*/
  unsetRelation(relation: string): this;

  /*Set the entire relations array on the model.*/
  setRelations(relations: any[]): this;

  /*Duplicate the instance and unset all the loaded relations.*/
  withoutRelations();

  /*Unset all the loaded relations for the instance.*/
  unsetRelations(): this;

  /*Get the relationships that are touched on save.*/
  getTouchedRelations(): any[];

  /*Set the relationships that are touched on save.*/
  setTouchedRelations(touches: any[]): this;
}

type HasRelationshipsCtor = Constructor<HasRelationships>;

/** Mixin to augment a directive with a `disableRipple` property. */
export function mixinHasRelationships<T extends Constructor<{}>>(base: T): HasRelationshipsCtor & T {
  // @ts-ignore
  return class _Self extends base {

    /*The loaded relationships for the model.*/
    /*protected */
    _relations: any = {};
    /*The relationships that should be touched on save.*/
    _touches: any[] = [];
    /*The many to many relationship methods.*/
    public static manyMethods: string[] = ['belongsToMany', 'morphToMany', 'morphedByMany'];
    /*The relation resolver callbacks.*/
    static _relationResolvers: any[] = [];

    /*Define a dynamic relation resolver.*/
    // public static resolveRelationUsing(name: string, callback: Function) {
    //   HasRelationships.relationResolvers = array_replace_recursive(
    //     HasRelationships.relationResolvers, {
    //       ['staticclass']: {[name]: callback}
    //     });
    // }

    // /*Define a one-to-one relationship.*/
    // public hasOne(this: _Self & Model & this, related: typeof Model,
    //               foreignKey: string | null = null,
    //               localKey: string | null   = null): HasOne {
    //   let instance = this._newRelatedInstance(related);
    //   foreignKey   = foreignKey || this.getForeignKey();
    //   localKey     = localKey || this.getKeyName();
    //   return this.newHasOne(
    //     instance.newQuery(),
    //     this,
    //     `${instance.getTable()}.${foreignKey}`,
    //     localKey);
    // }
    //
    // /*Instantiate a new HasOne relationship.*/
    // _newHasOne(query: FedacoBuilder, parent: Model, foreignKey: string, localKey: string): HasOne {
    //   return new HasOne(query, parent, foreignKey, localKey);
    // }
    //
    // /*Define a has-one-through relationship.*/
    // public hasOneThrough(this: _Self & Model & this,
    //                      related: typeof Model,
    //                      through: typeof Model,
    //                      firstKey: string | null       = null,
    //                      secondKey: string | null      = null,
    //                      localKey: string | null       = null,
    //                      secondLocalKey: string | null = null): HasOneThrough {
    //   const throughModel = new through();
    //   firstKey           = firstKey || this.getForeignKey();
    //   secondKey          = secondKey || throughModel.getForeignKey();
    //   return this._newHasOneThrough(
    //     this._newRelatedInstance(related).newQuery(),
    //     this,
    //     throughModel,
    //     firstKey,
    //     secondKey,
    //     localKey || this.getKeyName(),
    //     secondLocalKey || throughModel.getKeyName());
    // }
    //
    // /*Instantiate a new HasOneThrough relationship.*/
    // _newHasOneThrough(query: FedacoBuilder,
    //                   farParent: Model,
    //                   throughParent: Model,
    //                   firstKey: string,
    //                   secondKey: string,
    //                   localKey: string,
    //                   secondLocalKey: string): HasOneThrough {
    //   return new HasOneThrough(query, farParent, throughParent, firstKey, secondKey, localKey,
    //     secondLocalKey);
    // }
    //
    // /*Define a polymorphic one-to-one relationship.*/
    // public morphOne(this: _Self & Model & this,
    //                 related: typeof Model,
    //                 name: string,
    //                 type: string | null     = null,
    //                 id: string | null       = null,
    //                 localKey: string | null = null): MorphOne {
    //   let instance = this._newRelatedInstance(related);
    //   [type, id]   = this._getMorphs(name, type, id);
    //   let table    = instance.getTable();
    //   localKey     = localKey || this.getKeyName();
    //   return this._newMorphOne(
    //     instance.newQuery(), this,
    //     `${table}.${type}`, `${table}.${id}`,
    //     localKey
    //   );
    // }
    //
    // /*Instantiate a new MorphOne relationship.*/
    // _newMorphOne(query: FedacoBuilder, parent: Model, type: string, id: string,
    //              localKey: string): MorphOne {
    //   return new MorphOne(query, parent, type, id, localKey);
    // }
    //
    // /*Define an inverse one-to-one or many relationship.*/
    // public belongsTo(this: _Self & Model & this,
    //                  related: typeof Model,
    //                  foreignKey: string | null = null,
    //                  ownerKey: string | null   = null,
    //                  relation: string): BelongsTo {
    //   // if (isBlank(relation)) {
    //   //    relation = this.guessBelongsToRelation();
    //   // }
    //   let instance = this._newRelatedInstance(related);
    //   if (isBlank(foreignKey)) {
    //     foreignKey = `${snakeCase(relation)}_${instance.getKeyName()}`;
    //   }
    //   ownerKey = ownerKey || instance.getKeyName();
    //   return this._newBelongsTo(instance.newQuery(), this, foreignKey, ownerKey, relation);
    // }
    //
    // /*Instantiate a new BelongsTo relationship.*/
    // _newBelongsTo(query: FedacoBuilder, child: Model, foreignKey: string, ownerKey: string,
    //               relation: string): BelongsTo {
    //   return new BelongsTo(query, child, foreignKey, ownerKey, relation);
    // }
    //
    // /*Define a polymorphic, inverse one-to-one or many relationship.*/
    // public morphTo(this: _Self & Model & this, name: string,
    //                morphToClassMap: { [key: string]: typeof Model } = {},
    //                type: string | null                              = null,
    //                id: string | null                                = null,
    //                ownerKey: string | null                          = null): MorphTo {
    //   // let name         = name || this.guessBelongsToRelation();
    //   [type, id]     = this._getMorphs(snakeCase(name), type, id);
    //   const clazzKey = this._getAttributeFromArray(type);
    //   return isBlank(
    //     clazzKey) || clazzKey === '' || !morphToClassMap[clazzKey] ? this._morphEagerTo(
    //     name, type, id, ownerKey) : this._morphInstanceTo(morphToClassMap[clazzKey], name, type, id,
    //     ownerKey);
    // }
    //
    // /*Define a polymorphic, inverse one-to-one or many relationship.*/
    // _morphEagerTo(this: _Self & Model & this,
    //               name: string,
    //               type: string,
    //               id: string,
    //               ownerKey: string): MorphTo {
    //   return this._newMorphTo(this.newQuery().setEagerLoads([]), this, id, ownerKey, type, name);
    // }
    //
    // /*Define a polymorphic, inverse one-to-one or many relationship.*/
    // _morphInstanceTo(this: _Self & Model & this,
    //                  target: typeof Model, name: string, type: string,
    //                  id: string, ownerKey: string): MorphTo {
    //   let instance = this._newRelatedInstance(target/*_Self.getActualClassNameForMorph(target)*/);
    //   return this._newMorphTo(instance.newQuery(), this, id, ownerKey ?? instance.getKeyName(),
    //     type,
    //     name);
    // }
    //
    // /*Instantiate a new MorphTo relationship.*/
    // _newMorphTo(query: FedacoBuilder, parent: Model, foreignKey: string, ownerKey: string,
    //             type: string, relation: string): MorphTo {
    //   return new MorphTo(query, parent, foreignKey, ownerKey, type, relation);
    // }
    //
    // // /*Retrieve the actual class name for a given morph class.*/
    // // public static getActualClassNameForMorph(clazz: string) {
    // //   return Arr.get(Relation.morphMap() || [], clazz, clazz);
    // // }
    //
    // // /*Guess the "belongs to" relationship name.*/
    // // _guessBelongsToRelation() {
    // //   const [one, two, caller] = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3);
    // //   return caller['function'];
    // // }
    //
    // /*Define a one-to-many relationship.*/
    // public hasMany(this: _Self & Model & this, related: typeof Model,
    //                foreignKey: string | null = null,
    //                localKey: string | null   = null): HasMany {
    //   let instance = this._newRelatedInstance(related);
    //   foreignKey   = foreignKey || this.getForeignKey();
    //   localKey     = localKey || this.getKeyName();
    //   return this._newHasMany(instance.newQuery(), this, `${instance.getTable()}.${foreignKey}`,
    //     localKey);
    // }
    //
    // /*Instantiate a new HasMany relationship.*/
    // _newHasMany(query: FedacoBuilder, parent: Model, foreignKey: string,
    //             localKey: string): HasMany {
    //   return new HasMany(query, parent, foreignKey, localKey);
    // }
    //
    // /*Define a has-many-through relationship.*/
    // public hasManyThrough(this: _Self & Model & this,
    //                       related: typeof Model,
    //                       through: typeof Model,
    //                       firstKey: string | null       = null,
    //                       secondKey: string | null      = null,
    //                       localKey: string | null       = null,
    //                       secondLocalKey: string | null = null): HasManyThrough {
    //   const throughModel = new through();
    //   firstKey           = firstKey || this.getForeignKey();
    //   secondKey          = secondKey || throughModel.getForeignKey();
    //   return this._newHasManyThrough(this._newRelatedInstance(related).newQuery(), this,
    //     throughModel,
    //     firstKey, secondKey, localKey || this.getKeyName(),
    //     secondLocalKey || throughModel.getKeyName());
    // }
    //
    // /*Instantiate a new HasManyThrough relationship.*/
    // _newHasManyThrough(query: FedacoBuilder, farParent: Model, throughParent: Model,
    //                    firstKey: string, secondKey: string, localKey: string,
    //                    secondLocalKey: string): HasManyThrough {
    //   return new HasManyThrough(query, farParent, throughParent, firstKey, secondKey, localKey,
    //     secondLocalKey);
    // }
    //
    // /*Define a polymorphic one-to-many relationship.*/
    // public morphMany(this: _Self & Model & this,
    //                  related: typeof Model,
    //                  name: string,
    //                  type: string | null     = null,
    //                  id: string | null       = null,
    //                  localKey: string | null = null): MorphMany {
    //   let instance = this._newRelatedInstance(related);
    //   [type, id]   = this._getMorphs(name, type, id);
    //   let table    = instance.getTable();
    //   localKey     = localKey || this.getKeyName();
    //   return this._newMorphMany(
    //     instance.newQuery(), this,
    //     `${table}.${type}`, `${table}.${id}`,
    //     localKey);
    // }
    //
    // /*Instantiate a new MorphMany relationship.*/
    // _newMorphMany(query: FedacoBuilder, parent: Model, type: string, id: string,
    //               localKey: string): MorphMany {
    //   return new MorphMany(query, parent, type, id, localKey);
    // }
    //
    // /*Define a many-to-many relationship.*/
    // public belongsToMany(this: _Self & Model & this,
    //                      related: typeof Model,
    //                      table: string | null           = null,
    //                      foreignPivotKey: string | null = null,
    //                      relatedPivotKey: string | null = null,
    //                      parentKey: string | null       = null,
    //                      relatedKey: string | null      = null,
    //                      relation: string | null        = null): BelongsToMany {
    //   // if (isBlank(relation)) {
    //   //    relation = this.guessBelongsToManyRelation();
    //   // }
    //   let instance    = this._newRelatedInstance(related);
    //   foreignPivotKey = foreignPivotKey || this.getForeignKey();
    //   relatedPivotKey = relatedPivotKey || instance.getForeignKey();
    //   if (isBlank(table)) {
    //     table = this.joiningTable(related, instance);
    //   }
    //   return this._newBelongsToMany(
    //     instance.newQuery(), this, table, foreignPivotKey,
    //     relatedPivotKey, parentKey || this.getKeyName(),
    //     relatedKey || instance.getKeyName(),
    //     relation);
    // }
    //
    // /*Instantiate a new BelongsToMany relationship.*/
    // _newBelongsToMany(query: FedacoBuilder, parent: Model, table: string,
    //                   foreignPivotKey: string, relatedPivotKey: string, parentKey: string,
    //                   relatedKey: string, relationName: string | null = null): BelongsToMany {
    //   return new BelongsToMany(query, parent, table, foreignPivotKey, relatedPivotKey, parentKey,
    //     relatedKey, relationName);
    // }
    //
    // /*Define a polymorphic many-to-many relationship.*/
    // public morphToMany(this: _Self & Model & this,
    //                    related: typeof Model, name: string,
    //                    relationName: string,
    //                    table: string | null           = null,
    //                    foreignPivotKey: string | null = null,
    //                    relatedPivotKey: string | null = null,
    //                    parentKey: string | null       = null,
    //                    relatedKey: string | null      = null,
    //                    inverse: boolean               = false): MorphToMany {
    //   // let caller      = this.guessBelongsToManyRelation();
    //   // @ts-ignore
    //   let instance    = this._newRelatedInstance(related);
    //   foreignPivotKey = foreignPivotKey || name + '_id';
    //   relatedPivotKey = relatedPivotKey || instance.getForeignKey();
    //   if (!table) {
    //     let words    = name.split('_');
    //     let lastWord = words.pop();
    //     table        = words.join('') + plural(lastWord);
    //   }
    //   return this._newMorphToMany(instance.newQuery(), this, name, table, foreignPivotKey,
    //     relatedPivotKey, parentKey || this.getKeyName(), relatedKey || instance.getKeyName(),
    //     relationName, inverse);
    // }
    //
    // /*Instantiate a new MorphToMany relationship.*/
    // _newMorphToMany(query: FedacoBuilder, parent: Model, name: string, table: string,
    //                 foreignPivotKey: string, relatedPivotKey: string, parentKey: string,
    //                 relatedKey: string, relationName: string | null = null,
    //                 inverse: boolean                                = false): MorphToMany {
    //   return new MorphToMany(query, parent, name, table, foreignPivotKey, relatedPivotKey,
    //     parentKey, relatedKey, relationName, inverse);
    // }
    //
    // /*Define a polymorphic, inverse many-to-many relationship.*/
    // public morphedByMany(this: _Self & Model & this,
    //                      related: typeof Model, name: string,
    //                      relationName: string,
    //                      table: string | null           = null,
    //                      foreignPivotKey: string | null = null,
    //                      relatedPivotKey: string | null = null,
    //                      parentKey: string | null       = null,
    //                      relatedKey: string | null      = null): MorphToMany {
    //   foreignPivotKey = foreignPivotKey || this.getForeignKey();
    //   relatedPivotKey = relatedPivotKey || name + '_id';
    //   return this.morphToMany(related, name, relationName,
    //     table, foreignPivotKey, relatedPivotKey, parentKey, relatedKey, true);
    // }

    /*Get the relationship name of the belongsToMany relationship.*/
    // _guessBelongsToManyRelation() {
    //   let caller = Arr.first(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS), trace => {
    //     return !in_array(trace['function'],
    //       [...HasRelationships.manyMethods, ...['guessBelongsToManyRelation']]);
    //   });
    //   return !isBlank(caller) ? caller['function'] : null;
    // }

    /*Get the joining table name for a many-to-many relation.*/
    public joiningTable(related: typeof Model, instance: Model | null = null): string {
      let segments = [
        instance ? instance.joiningTableSegment() : snakeCase(related.name),
        this.joiningTableSegment()
      ];
      segments.sort();
      return segments.join('_').toLowerCase();
    }

    /*Get this model's half of the intermediate table name for belongsToMany relationships.*/
    public joiningTableSegment(): string {
      return snakeCase(this.constructor.name);
    }

    /*Determine if the model touches a given relation.*/
    public touches(relation: string) {
      return this.getTouchedRelations().includes(relation);
    }

    // /*Touch the owning relations of the model.*/
    // public touchOwners() {
    //   for (let relation of this.getTouchedRelations()) {
    //     this[relation]().touch();
    //     if (this[relation] instanceof _Self.constructor) {
    //       this[relation].fireModelEvent('saved', false);
    //       this[relation].touchOwners();
    //     } else if (isArray(this[relation])) {
    //       this[relation].forEach(it => it.touchOwners());
    //     }
    //   }
    // }

    /*Get the polymorphic relationship columns.*/
    _getMorphs(name: string, type: string, id: string): string[] {
      return [type || name + '_type', id || name + '_id'];
    }

    /*Get the class name for polymorphic relations.*/
    public getMorphClass() {
      let morphMap = Relation.morphMap();
      if (morphMap.length && morphMap.includes(this.constructor.name)) {
        // @ts-ignore
        return morphMap[this.constructor.name];
      }
      return this.constructor.name;
    }

    /*Create a new model instance for a related model.*/
    _newRelatedInstance(this: _Self & Model & this, clazz: typeof Model) {
      const ins               = tap(instance => {
        if (!instance.getConnectionName()) {
          instance.setConnection(this._connection);
        }
      }, new clazz());
      // todo fixme should move to another place
      (ins.constructor as any).resolver = {
        connection() {
          return {
            query() {
              const grammar   = new MysqlGrammar();
              const processor = new Processor();

              // @ts-ignore
              return new QueryBuilder({
                getName(): string {
                  return 'this-is-a-connection-name-placeholder';
                },
                select(sql, bindings) {
                  return {
                    sql, bindings
                  };
                },
              }, grammar, processor);
            }
          };
        }
      };

      return ins;
    }

    getRelationMethod(this: Model & _Self, relation: string) {
      const metadata = this.isRelation(relation);
      if (metadata) {
        return metadata._getRelation(this, relation);
      }
      return undefined;
    }

    /*Get all the loaded relations for the instance.*/
    public getRelations() {
      return this._relations;
    }

    /*Get a specified relationship.*/
    public getRelation(relation: string) {
      return this._relations[relation];
    }

    /*Determine if the given relation is loaded.*/
    public relationLoaded(key: string) {
      return key in this._relations;
    }

    /*Set the given relationship on the model.*/
    public setRelation(relation: string, value: any): this {
      this._relations[relation] = value;
      return this;
    }

    /*Unset a loaded relationship.*/
    public unsetRelation(relation: string): this {
      delete this._relations[relation];
      return this;
    }

    /*Set the entire relations array on the model.*/
    public setRelations(relations: any[]): this {
      this._relations = relations;
      return this;
    }

    /*Duplicate the instance and unset all the loaded relations.*/
    public withoutRelations(this: _Self & Model & this) {
      let model = this.clone();
      return model.unsetRelations();
    }

    /*Unset all the loaded relations for the instance.*/
    public unsetRelations(): this {
      this._relations = [];
      return this;
    }

    /*Get the relationships that are touched on save.*/
    public getTouchedRelations(): any[] {
      return this._touches;
    }

    /*Set the relationships that are touched on save.*/
    public setTouchedRelations(touches: any[]): this {
      this._touches = touches;
      return this;
    }
  };
}
