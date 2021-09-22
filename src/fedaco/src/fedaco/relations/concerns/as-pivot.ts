/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Constructor } from '../../../helper/constructor';
import { FedacoBuilder } from '../../fedaco-builder';
import { isArray } from '@gradii/check-type';
import { tap } from 'ramda'
import { Model } from '../../model';

export declare class AsPivot {
  // _setKeysForSelectQuery(query: FedacoBuilder);
  //
  // /*Set the keys for a save update query.*/
  // _setKeysForSaveQuery(query: FedacoBuilder): FedacoBuilder;
  //
  // /*Delete the pivot model record from the database.*/
  // delete();
  //
  // /*Get the query builder for a delete operation on the pivot.*/
  // _getDeleteQuery();
  //
  // /*Get the table associated with the model.*/
  // getTable();
  //
  // /*Get the foreign key column name.*/
  // getForeignKey();
  //
  // /*Get the "related key" column name.*/
  // getRelatedKey();
  //
  // /*Get the "related key" column name.*/
  // getOtherKey();
  //
  // /*Set the key names for the pivot model instance.*/
  // setPivotKeys(foreignKey: string, relatedKey: string);
  //
  // /*Determine if the pivot model or given attributes has timestamp attributes.*/
  // hasTimestampAttributes(attributes?: any[] | null);
  //
  // /*Get the name of the "created at" column.*/
  // getCreatedAtColumn();
  //
  // /*Get the name of the "updated at" column.*/
  // getUpdatedAtColumn();
  //
  // /*Get the queueable identity for the entity.*/
  // getQueueableId();
  //
  // /*Get a new query to restore one or more models by their queueable IDs.*/
  // newQueryForRestoration(this: Model & this, ids: number[] | string[] | string);
  //
  // /*Get a new query to restore multiple models by their queueable IDs.*/
  // _newQueryForCollectionRestoration(ids: number[] | string[]);
  //
  // /*Unset all the loaded relations for the instance.*/
  // unsetRelations();
}

export type AsPivotCtor = Constructor<AsPivot>;

export function mixinAsPivot<T extends Constructor<any>>(base: T): AsPivotCtor & T {
  return class _Self extends base {
    /*The parent model of the relationship.*/
    public pivotParent: Model;
    /*The name of the foreign key column.*/
    _foreignKey: string;
    /*The name of the "other key" column.*/
    _relatedKey: string;

    /*Create a new pivot model instance.*/
    public static fromAttributes(parent: Model, attributes: any[], table: string,
                                 exists = false) {
      const instance        = new this();
      instance.timestamps = instance.hasTimestampAttributes(attributes);
      instance.setConnection(parent.getConnectionName()).setTable(table).forceFill(
        attributes).syncOriginal();
      instance.pivotParent = parent;
      instance.exists      = exists;
      return instance;
    }

    /*Create a new pivot model from raw values returned from a query.*/
    public static fromRawAttributes(parent: Model, attributes: any[], table: string,
                                    exists = false) {
      const instance        = this.fromAttributes(parent, [], table, exists);
      instance.timestamps = instance.hasTimestampAttributes(attributes);
      instance.setRawAttributes(attributes, exists);
      return instance;
    }

    /*Set the keys for a select query.*/
    protected _setKeysForSelectQuery(this: Model & _Self, query: FedacoBuilder) {
      if (this._attributes[this.getKeyName()] !== undefined) {
        return super._setKeysForSelectQuery(query);
      }
      query.where(this._foreignKey,
        this.getOriginal(this._foreignKey, this.getAttribute(this._foreignKey)));
      return query.where(this._relatedKey,
        this.getOriginal(this._relatedKey, this.getAttribute(this._relatedKey)));
    }

    /*Set the keys for a save update query.*/
    _setKeysForSaveQuery(this: Model & this, query: FedacoBuilder) {
      return this._setKeysForSelectQuery(query);
    }

    /*Delete the pivot model record from the database.*/
    public async delete(this: Model & this) {
      if (this._attributes[this.getKeyName()] !== undefined) {
        return /*cast type int*/ super.delete();
      }
      if (this._fireModelEvent('deleting') === false) {
        return 0;
      }
      this.touchOwners();
      return tap(() => {
        this._exists = false;
        this._fireModelEvent('deleted', false);
      }, await this._getDeleteQuery().delete());
    }

    /*Get the query builder for a delete operation on the pivot.*/
    _getDeleteQuery(this: Model & _Self) {
      return this.newQueryWithoutRelationships().where({
        [this._foreignKey]: this.getOriginal(this._foreignKey, this.getAttribute(this._foreignKey)),
        [this._relatedKey]: this.getOriginal(this._relatedKey, this.getAttribute(this._relatedKey)),
      });
    }

    /*Get the table associated with the model.*/
    public getTable(this: Model & _Self): string {
      if (!(this._table !== undefined)) {
        //todo fixme
        // this.setTable(str_replace('\\', '', Str.snake(Str.singular(class_basename(this)))));
      }
      return this._table;
    }

    /*Get the foreign key column name.*/
    public getForeignKey() {
      return this._foreignKey;
    }

    /*Get the "related key" column name.*/
    public getRelatedKey() {
      return this._relatedKey;
    }

    /*Get the "related key" column name.*/
    public getOtherKey() {
      return this.getRelatedKey();
    }

    /*Set the key names for the pivot model instance.*/
    public setPivotKeys(foreignKey: string, relatedKey: string) {
      this._foreignKey = foreignKey;
      this._relatedKey = relatedKey;
      return this;
    }

    /*Determine if the pivot model or given attributes has timestamp attributes.*/
    public hasTimestampAttributes(attributes: any[] | null = null) {
      return this.getCreatedAtColumn() in (attributes ?? this.attributes);
    }

    /*Get the name of the "created at" column.*/
    public getCreatedAtColumn() {
      return this.pivotParent ? this.pivotParent.getCreatedAtColumn() : super.getCreatedAtColumn();
    }

    /*Get the name of the "updated at" column.*/
    public getUpdatedAtColumn() {
      return this.pivotParent ? this.pivotParent.getUpdatedAtColumn() : super.getUpdatedAtColumn();
    }

    /*Get the queueable identity for the entity.*/
    public getQueueableId() {
      if (this._attributes[this.getKeyName()] !== undefined) {
        return this.getKey();
      }
      return `${this._foreignKey}:${this.getAttribute(
        this._foreignKey)}:${this._relatedKey}:${this.getAttribute(this._relatedKey)}`;
    }

    /*Get a new query to restore one or more models by their queueable IDs.*/
    public newQueryForRestoration(this: Model & this, ids: number[] | string[] | string) {
      if (isArray(ids)) {
        return this._newQueryForCollectionRestoration(ids as any[]);
      }
      if (!ids.includes(':')) {
        return super.newQueryForRestoration(ids);
      }
      const segments = ids.split(':');
      return this.newQueryWithoutScopes().where(segments[0], segments[1]).where(segments[2],
        segments[3]);
    }

    /*Get a new query to restore multiple models by their queueable IDs.*/
    _newQueryForCollectionRestoration(ids: number[] | string[]) {
      if (!(`${ids[0]}`).includes(':')) {
        return super.newQueryForRestoration(ids);
      }
      const query = this.newQueryWithoutScopes();
      for (const id of ids as string[]) {
        const segments = id.split(':');
        query.orWhere(q => {
          return q.where(segments[0], segments[1]).where(segments[2], segments[3]);
        });
      }
      return query;
    }

    /*Unset all the loaded relations for the instance.*/
    public unsetRelations(this: Model & _Self) {
      this.pivotParent = null;
      this._relations  = [];
      return this;
    }
  };
}
