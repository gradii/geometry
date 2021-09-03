/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { tap } from 'ramda';
import { Constructor } from '../../helper/constructor';
import { snakeCase } from '../../helper/str';
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
import { BelongsTo } from '../relations/belongs-to';
import { BelongsToMany } from '../relations/belongs-to-many';
import { HasMany } from '../relations/has-many';
import { HasManyThrough } from '../relations/has-many-through';
import { HasOne } from '../relations/has-one';
import { HasOneThrough } from '../relations/has-one-through';
import { MorphMany } from '../relations/morph-many';
import { MorphOne } from '../relations/morph-one';
import { MorphTo } from '../relations/morph-to';
import { MorphToMany } from '../relations/morph-to-many';
import { Relation } from '../relations/relation';

/** Mixin to augment a directive with a `disableRipple` property. */
export function mixinHasRelationships<T extends Constructor<{}>>(base: T) {
  // @ts-ignore
  return class HasRelationships extends base {

    /*The loaded relationships for the model.*/
    /*protected */
    _relations: any = {};
    /*The relationships that should be touched on save.*/
    protected _touches: any[] = [];
    /*The many to many relationship methods.*/
    public static manyMethods: string[] = ['belongsToMany', 'morphToMany', 'morphedByMany'];
    /*The relation resolver callbacks.*/
    protected static relationResolvers: any[] = [];

    /*Define a dynamic relation resolver.*/
    // public static resolveRelationUsing(name: string, callback: Function) {
    //   HasRelationships.relationResolvers = array_replace_recursive(
    //     HasRelationships.relationResolvers, {
    //       ['staticclass']: {[name]: callback}
    //     });
    // }

    /*Define a one-to-one relationship.*/
    public hasOne(this: Model & this, related: string,
                  foreignKey: string | null = null,
                  localKey: string | null   = null): HasOne {
      let instance = this._newRelatedInstance(related);
      foreignKey   = foreignKey || this.getForeignKey();
      localKey     = localKey || this.getKeyName();
      return this.newHasOne(
        instance.newQuery(),
        this,
        `${instance.getTable()}.${foreignKey}`,
        localKey);
    }

    /*Instantiate a new HasOne relationship.*/
    protected newHasOne(query: FedacoBuilder, parent: Model, foreignKey: string, localKey: string) {
      return new HasOne(query, parent, foreignKey, localKey);
    }

    /*Define a has-one-through relationship.*/
    public hasOneThrough(this: Model & this,
                         related: typeof Model,
                         through: typeof Model,
                         firstKey: string | null       = null,
                         secondKey: string | null      = null,
                         localKey: string | null       = null,
                         secondLocalKey: string | null = null) {
      const throughModel = new through();
      firstKey           = firstKey || this.getForeignKey();
      secondKey          = secondKey || throughModel.getForeignKey();
      return this.newHasOneThrough(
        this._newRelatedInstance(related).newQuery(),
        this,
        throughModel,
        firstKey,
        secondKey,
        localKey || this.getKeyName(),
        secondLocalKey || throughModel.getKeyName());
    }

    /*Instantiate a new HasOneThrough relationship.*/
    protected newHasOneThrough(query: FedacoBuilder,
                               farParent: Model,
                               throughParent: Model,
                               firstKey: string,
                               secondKey: string,
                               localKey: string,
                               secondLocalKey: string) {
      return new HasOneThrough(query, farParent, throughParent, firstKey, secondKey, localKey,
        secondLocalKey);
    }

    /*Define a polymorphic one-to-one relationship.*/
    public morphOne(this: Model & this,
                    related: typeof Model,
                    name: string,
                    type: string | null     = null,
                    id: string | null       = null,
                    localKey: string | null = null) {
      let instance = this._newRelatedInstance(related);
      [type, id]   = this.getMorphs(name, type, id);
      let table    = instance.getTable();
      localKey     = localKey || this.getKeyName();
      return this.newMorphOne(
        instance.newQuery(), this,
        `${table}.${type}`, `${table}.${id}`,
        localKey
      );
    }

    /*Instantiate a new MorphOne relationship.*/
    protected newMorphOne(query: FedacoBuilder, parent: Model, type: string, id: string,
                          localKey: string) {
      return new MorphOne(query, parent, type, id, localKey);
    }

    /*Define an inverse one-to-one or many relationship.*/
    public belongsTo(this: Model & this,
                     related: typeof Model,
                     foreignKey: string | null = null,
                     ownerKey: string | null   = null,
                     relation: string) {
      // if (isBlank(relation)) {
      //    relation = this.guessBelongsToRelation();
      // }
      let instance = this._newRelatedInstance(related);
      if (isBlank(foreignKey)) {
        foreignKey = `${snakeCase(relation)}_${instance.getKeyName()}`;
      }
      ownerKey = ownerKey || instance.getKeyName();
      return this.newBelongsTo(instance.newQuery(), this, foreignKey, ownerKey, relation);
    }

    /*Instantiate a new BelongsTo relationship.*/
    protected newBelongsTo(query: FedacoBuilder, child: Model, foreignKey: string, ownerKey: string,
                           relation: string) {
      return new BelongsTo(query, child, foreignKey, ownerKey, relation);
    }

    /*Define a polymorphic, inverse one-to-one or many relationship.*/
    public morphTo(this: Model & this, name: string,
                   type: string | null     = null,
                   id: string | null       = null,
                   ownerKey: string | null = null) {
      // let name         = name || this.guessBelongsToRelation();
      [type, id]  = this.getMorphs(snakeCase(name), type, id);
      const clazz = this._getAttributeFromArray(type);
      return isBlank(clazz) || clazz === '' ? this.morphEagerTo(
        name, type, id, ownerKey) : this.morphInstanceTo(clazz, name, type, id, ownerKey);
    }

    /*Define a polymorphic, inverse one-to-one or many relationship.*/
    protected morphEagerTo(this: Model & this,
                           name: string,
                           type: string,
                           id: string,
                           ownerKey: string) {
      return this.newMorphTo(this.newQuery().setEagerLoads([]), this, id, ownerKey, type, name);
    }

    /*Define a polymorphic, inverse one-to-one or many relationship.*/
    protected morphInstanceTo(target: string, name: string, type: string, id: string,
                              ownerKey: string) {
      let instance = this._newRelatedInstance(HasRelationships.getActualClassNameForMorph(target));
      return this.newMorphTo(instance.newQuery(), this, id, ownerKey ?? instance.getKeyName(), type,
        name);
    }

    /*Instantiate a new MorphTo relationship.*/
    protected newMorphTo(query: FedacoBuilder, parent: Model, foreignKey: string, ownerKey: string,
                         type: string, relation: string) {
      return new MorphTo(query, parent, foreignKey, ownerKey, type, relation);
    }

    /*Retrieve the actual class name for a given morph class.*/
    public static getActualClassNameForMorph(clazz: string) {
      return Arr.get(Relation.morphMap() || [], clazz, clazz);
    }

    // /*Guess the "belongs to" relationship name.*/
    // protected guessBelongsToRelation() {
    //   const [one, two, caller] = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3);
    //   return caller['function'];
    // }

    /*Define a one-to-many relationship.*/
    public hasMany(this: Model & this, related: string,
                   foreignKey: string | null = null,
                   localKey: string | null   = null) {
      let instance = this._newRelatedInstance(related);
      foreignKey   = foreignKey || this.getForeignKey();
      localKey     = localKey || this.getKeyName();
      return this.newHasMany(instance.newQuery(), this, `${instance.getTable()}.${foreignKey}`,
        localKey);
    }

    /*Instantiate a new HasMany relationship.*/
    protected newHasMany(query: FedacoBuilder, parent: Model, foreignKey: string,
                         localKey: string) {
      return new HasMany(query, parent, foreignKey, localKey);
    }

    /*Define a has-many-through relationship.*/
    public hasManyThrough(related: string,
                          through: typeof Model,
                          firstKey: string | null       = null,
                          secondKey: string | null      = null,
                          localKey: string | null       = null,
                          secondLocalKey: string | null = null) {
      const throughModel = new through();
      firstKey           = firstKey || this.getForeignKey();
      secondKey          = secondKey || throughModel.getForeignKey();
      return this.newHasManyThrough(this._newRelatedInstance(related).newQuery(), this,
        throughModel,
        firstKey, secondKey, localKey || this.getKeyName(),
        secondLocalKey || throughModel.getKeyName());
    }

    /*Instantiate a new HasManyThrough relationship.*/
    protected newHasManyThrough(query: FedacoBuilder, farParent: Model, throughParent: Model,
                                firstKey: string, secondKey: string, localKey: string,
                                secondLocalKey: string) {
      return new HasManyThrough(query, farParent, throughParent, firstKey, secondKey, localKey,
        secondLocalKey);
    }

    /*Define a polymorphic one-to-many relationship.*/
    public morphMany(this: Model & this,
                     related: string,
                     name: string,
                     type: string | null     = null,
                     id: string | null       = null,
                     localKey: string | null = null) {
      let instance = this._newRelatedInstance(related);
      [type, id]   = this.getMorphs(name, type, id);
      let table    = instance.getTable();
      localKey     = localKey || this.getKeyName();
      return this.newMorphMany(
        instance.newQuery(), this,
        `${table}.${type}`, `${table}.${id}`,
        localKey);
    }

    /*Instantiate a new MorphMany relationship.*/
    protected newMorphMany(query: FedacoBuilder, parent: Model, type: string, id: string,
                           localKey: string) {
      return new MorphMany(query, parent, type, id, localKey);
    }

    /*Define a many-to-many relationship.*/
    public belongsToMany(related: string,
                         table: string | null           = null,
                         foreignPivotKey: string | null = null,
                         relatedPivotKey: string | null = null,
                         parentKey: string | null       = null,
                         relatedKey: string | null      = null,
                         relation: string | null        = null) {
      // if (isBlank(relation)) {
      //    relation = this.guessBelongsToManyRelation();
      // }
      let instance    = this._newRelatedInstance(related);
      foreignPivotKey = foreignPivotKey || this.getForeignKey();
      relatedPivotKey = relatedPivotKey || instance.getForeignKey();
      if (isBlank(table)) {
        table = this.joiningTable(related, instance);
      }
      return this.newBelongsToMany(
        instance.newQuery(), this, table, foreignPivotKey,
        relatedPivotKey, parentKey || this.getKeyName(),
        relatedKey || instance.getKeyName(),
        relation);
    }

    /*Instantiate a new BelongsToMany relationship.*/
    protected newBelongsToMany(query: FedacoBuilder, parent: Model, table: string,
                               foreignPivotKey: string, relatedPivotKey: string, parentKey: string,
                               relatedKey: string, relationName: string | null = null) {
      return new BelongsToMany(query, parent, table, foreignPivotKey, relatedPivotKey, parentKey,
        relatedKey, relationName);
    }

    /*Define a polymorphic many-to-many relationship.*/
    public morphToMany(related: string, name: string, table: string | null = null,
                       foreignPivotKey: string | null                      = null,
                       relatedPivotKey: string | null                      = null,
                       parentKey: string | null                            = null,
                       relatedKey: string | null                           = null,
                       inverse: boolean                                    = false) {
      // let caller      = this.guessBelongsToManyRelation();
      let instance    = this._newRelatedInstance(related);
      foreignPivotKey = foreignPivotKey || name + '_id';
      relatedPivotKey = relatedPivotKey || instance.getForeignKey();
      if (!table) {
        let words    = preg_split('/(_)/u', name, -1, PREG_SPLIT_DELIM_CAPTURE);
        let lastWord = array_pop(words);
        let table    = words.join('') + Str.plural(lastWord);
      }
      return this.newMorphToMany(instance.newQuery(), this, name, table, foreignPivotKey,
        relatedPivotKey, parentKey || this.getKeyName(), relatedKey || instance.getKeyName(),
        caller, inverse);
    }

    /*Instantiate a new MorphToMany relationship.*/
    protected newMorphToMany(query: FedacoBuilder, parent: Model, name: string, table: string,
                             foreignPivotKey: string, relatedPivotKey: string, parentKey: string,
                             relatedKey: string, relationName: string | null = null,
                             inverse: boolean                                = false) {
      return new MorphToMany(query, parent, name, table, foreignPivotKey, relatedPivotKey,
        parentKey, relatedKey, relationName, inverse);
    }

    /*Define a polymorphic, inverse many-to-many relationship.*/
    public morphedByMany(related: string, name: string, table: string | null = null,
                         foreignPivotKey: string | null                      = null,
                         relatedPivotKey: string | null                      = null,
                         parentKey: string | null                            = null,
                         relatedKey: string | null                           = null) {
      foreignPivotKey = foreignPivotKey || this.getForeignKey();
      relatedPivotKey = relatedPivotKey || name + '_id';
      return this.morphToMany(related, name, table, foreignPivotKey, relatedPivotKey, parentKey,
        relatedKey, true);
    }

    /*Get the relationship name of the belongsToMany relationship.*/
    // protected guessBelongsToManyRelation() {
    //   let caller = Arr.first(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS), trace => {
    //     return !in_array(trace['function'],
    //       [...HasRelationships.manyMethods, ...['guessBelongsToManyRelation']]);
    //   });
    //   return !isBlank(caller) ? caller['function'] : null;
    // }

    /*Get the joining table name for a many-to-many relation.*/
    public joiningTable(related: string, instance: Model | null = null) {
      let segments = [
        instance ? instance.joiningTableSegment() : Str.snake(class_basename(related)),
        this.joiningTableSegment()
      ];
      sort(segments);
      return segments.join('_').toLowerCase();
    }

    /*Get this model's half of the intermediate table name for belongsToMany relationships.*/
    public joiningTableSegment() {
      return Str.snake(class_basename(this));
    }

    /*Determine if the model touches a given relation.*/
    public touches(relation: string) {
      return this.getTouchedRelations().includes(relation);
    }

    /*Touch the owning relations of the model.*/
    public touchOwners() {
      for (let relation of this.getTouchedRelations()) {
        this.relation().touch();
        if (this.relation instanceof HasRelationships) {
          this.relation.fireModelEvent('saved', false);
          this.relation.touchOwners();
        } else if (this.relation instanceof Collection) {
          this.relation.each.touchOwners();
        }
      }
    }

    /*Get the polymorphic relationship columns.*/
    protected getMorphs(name: string, type: string, id: string) {
      return [type || name + '_type', id || name + '_id'];
    }

    /*Get the class name for polymorphic relations.*/
    public getMorphClass() {
      let morphMap = Relation.morphMap();
      if (!empty(morphMap) && in_array(HasRelationships, morphMap)) {
        return array_search(HasRelationships, morphMap, true);
      }
      return HasRelationships;
    }

    /*Create a new model instance for a related model.*/
    protected _newRelatedInstance(this: Model & this, clazz: typeof Model) {
      return tap(instance => {
        if (!instance.getConnectionName()) {
          instance.setConnection(this._connection);
        }
      }, new clazz());
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
    public setRelation(relation: string, value: any) {
      this._relations[relation] = value;
      return this;
    }

    /*Unset a loaded relationship.*/
    public unsetRelation(relation: string) {
      delete this._relations[relation];
      return this;
    }

    /*Set the entire relations array on the model.*/
    public setRelations(relations: any[]) {
      this._relations = relations;
      return this;
    }

    /*Duplicate the instance and unset all the loaded relations.*/
    public withoutRelations() {
      let model = ();
      return model.unsetRelations();
    }

    /*Unset all the loaded relations for the instance.*/
    public unsetRelations() {
      this._relations = [];
      return this;
    }

    /*Get the relationships that are touched on save.*/
    public getTouchedRelations() {
      return this._touches;
    }

    /*Set the relationships that are touched on save.*/
    public setTouchedRelations(touches: any[]) {
      this._touches = touches;
      return this;
    }
  };
}
