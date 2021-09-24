/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isArray, isBlank } from '@gradii/check-type';
import { difference, intersection } from 'ramda';
import { Collection } from '../../../define/collection';
import { mapWithKeys } from '../../../helper/arr';
import { Constructor } from '../../../helper/constructor';
import { BaseModel } from '../../base-model';
import { Model } from '../../model';
import { Relation } from '../relation';

export interface InteractsWithPivotTable {
  /**
   * Toggles a model (or models) from the parent.
   * Each existing model is detached, and non existing ones are attached.
   */
  toggle(ids: any, touch?: boolean);

  /*Sync the intermediate tables with a list of IDs without detaching.*/
  syncWithoutDetaching(ids: Collection | Model | any[]);

  /*Sync the intermediate tables with a list of IDs or collection of models.*/
  sync(ids: Collection | Model | any[], detaching?: boolean);

  /*Sync the intermediate tables with a list of IDs or collection of models with the given pivot values.*/
  syncWithPivotValues(ids: Collection | Model | any[], values: any[], detaching?: boolean);

  /*Format the sync / toggle record list so that it is keyed by ID.*/
  _formatRecordsList(records: any[]);

  /*Attach all of the records that aren't in the given current records.*/
  _attachNew(records: any[], current: any[], touch?: boolean);

  /*Update an existing pivot record on the table.*/
  updateExistingPivot(id: any, attributes: any[], touch?: boolean);

  /*Update an existing pivot record on the table via a custom class.*/
  _updateExistingPivotUsingCustomClass(id: any, attributes: any[], touch: boolean);

  /*Attach a model to the parent.*/
  attach(id: any, attributes?: any[], touch?: boolean);

  /*Attach a model to the parent using a custom class.*/
  _attachUsingCustomClass(id: any, attributes: any[]);

  /*Create an array of records to insert into the pivot table.*/
  _formatAttachRecords(ids: any[], attributes: any[]);

  /*Create a full attachment record payload.*/
  _formatAttachRecord(key: number, value: any, attributes: any[], hasTimestamps: boolean);

  /*Get the attach record ID and extra attributes.*/
  _extractAttachIdAndAttributes(key: any, value: any, attributes: any[]);

  /*Create a new pivot attachment record.*/
  _baseAttachRecord(id: number, timed: boolean);

  /*Set the creation and update timestamps on an attach record.*/
  _addTimestampsToAttachment(record: any[], exists?: boolean);

  /*Determine whether the given column is defined as a pivot column.*/
  hasPivotColumn(column: string);

  /*Detach models from the relationship.*/
  detach(ids?: any, touch?: boolean);

  /*Detach models from the relationship using a custom class.*/
  _detachUsingCustomClass(ids: any);

  /*Get the pivot models that are currently attached.*/
  _getCurrentlyAttachedPivots();

  /*Create a new pivot model instance.*/
  newPivot(attributes?: any[], exists?: boolean);

  /*Create a new existing pivot model instance.*/
  newExistingPivot(attributes?: any[]);

  /*Get a new plain query builder for the pivot table.*/
  newPivotStatement();

  /*Get a new pivot statement for a given "other" ID.*/
  newPivotStatementForId(id: any);

  /*Create a new query builder for the pivot table.*/
  newPivotQuery();

  /*Set the columns on the pivot table to retrieve.*/
  withPivot(columns: any[] | any, ...cols: any[]);

  /*Get all of the IDs from the given mixed value.*/
  _parseIds(value: any);

  /*Get the ID from the given mixed value.*/
  _parseId(value: any);

  /*Cast the given keys to integers if they are numeric and string otherwise.*/
  _castKeys(keys: any[]);

  /*Cast the given key to convert to primary key type.*/
  _castKey(key: any);

  /*Cast the given pivot attributes.*/
  _castAttributes(attributes: any[]);

  /*Converts a given value to a given type value.*/
  _getTypeSwapValue(type: string, value: any);
}

type InteractsWithPivotTableCtor = Constructor<InteractsWithPivotTable>;


export function mixinInteractsWithPivotTable<T extends Constructor<any>>(base: T): InteractsWithPivotTableCtor & T {

  return class _Self extends base {
    /*Toggles a model (or models) from the parent.

    Each existing model is detached, and non existing ones are attached.*/
    public toggle(this: Relation & _Self, ids: any, touch = true) {
      const changes: any = {
        attached: [],
        detached: []
      };
      const records      = this._formatRecordsList(this._parseIds(ids));
      const detach       = Object.values(
        intersection(
          this.newPivotQuery().pluck(this.relatedPivotKey).all(),
          Object.keys(records)
        )
      );
      if (detach.length > 0) {
        this.detach(detach, false);
        changes['detached'] = this.castKeys(detach);
      }
      const attach = difference(Object.keys(records), detach);
      if (attach.length > 0) {
        this.attach(attach, [], false);
        changes['attached'] = Object.keys(attach);
      }
      if (touch && (
        changes['attached'].length ||
        changes['detached'].length
      )
      ) {
        this.touchIfTouching();
      }
      return changes;
    }

    /*Sync the intermediate tables with a list of IDs without detaching.*/
    public syncWithoutDetaching(this: Relation & _Self, ids: Collection | Model | any[]) {
      return this.sync(ids, false);
    }

    /*Sync the intermediate tables with a list of IDs or collection of models.*/
    public sync(this: Relation & _Self, ids: Collection | Model | any[] | any, detaching = true) {
      let changes: any = {
        attached: [],
        detached: [],
        updated : []
      };
      const current    = this.getCurrentlyAttachedPivots().pluck(this.relatedPivotKey).all();
      const records    = this._formatRecordsList(this._parseIds(ids));
      const detach     = difference(current, Object.keys(records));
      if (detaching && detach.length > 0) {
        this.detach(detach);
        changes['detached'] = this.castKeys(detach);
      }
      changes = [...changes, ...this.attachNew(records, current, false)];
      if (changes['attached'].length || changes['updated'].length || changes['detached'].length) {
        this.touchIfTouching();
      }
      return changes;
    }

    /*Sync the intermediate tables with a list of IDs or collection of models with the given pivot values.*/
    public syncWithPivotValues(this: Relation & _Self, ids: Model | Model[], values: any[],
                               detaching = true) {
      return this.sync(
        mapWithKeys(this._parseIds(ids), id => {
          return {id: values};
        }), detaching);
    }

    /*Format the sync / toggle record list so that it is keyed by ID.*/
    _formatRecordsList(this: Relation & _Self, records: any[]) {
      return mapWithKeys(records, (attributes, id) => {
        if (!isArray(attributes)) {
          // @ts-ignore
          const [id, attributes] = [attributes, []];
        }
        return {};
      });
    }

    /*Attach all of the records that aren't in the given current records.*/
    _attachNew(this: Relation & _Self, records: any[], current: any[], touch = true) {
      const changes = {
        attached: [],
        updated : []
      };
      for (const [id, attributes] of Object.entries(records)) {
        if (!current.includes(id)) {
          this.attach(id, attributes, touch);
          changes['attached'].push(this.castKey(id));
        } else if (attributes.length > 0 && this.updateExistingPivot(id, attributes, touch)) {
          changes['updated'].push(this.castKey(id));
        }
      }
      return changes;
    }

    /*Update an existing pivot record on the table.*/
    public updateExistingPivot(this: Relation & _Self, id: any, attributes: any[], touch = true) {
      if (this._using &&
        !this._pivotWheres.length &&
        !this._pivotWhereIns.length &&
        !this._pivotWhereNulls.length
      ) {
        return this._updateExistingPivotUsingCustomClass(id, attributes, touch);
      }
      if (this.pivotColumns.includes(this.updatedAt())) {
        attributes = this.addTimestampsToAttachment(attributes, true);
      }
      const updated = this.newPivotStatementForId(this.parseId(id)).update(
        this.castAttributes(attributes));
      if (touch) {
        this.touchIfTouching();
      }
      return updated;
    }

    /*Update an existing pivot record on the table via a custom class.*/
    _updateExistingPivotUsingCustomClass(this: Relation & _Self, id: any, attributes: any[],
                                         touch: boolean) {
      const pivot   = this.getCurrentlyAttachedPivots().where(this.foreignPivotKey,
        this.parent[this.parentKey]).where(this.relatedPivotKey, this.parseId(id)).first();
      const updated = pivot ? pivot.fill(attributes).isDirty() : false;
      if (updated) {
        pivot.save();
      }
      if (touch) {
        this.touchIfTouching();
      }
      return /*cast type int*/ updated;
    }

    /*Attach a model to the parent.*/
    public attach(this: Relation & _Self, id: any, attributes: any[] = [], touch = true) {
      if (this.using) {
        this._attachUsingCustomClass(id, attributes);
      } else {
        this.newPivotStatement().insert(this.formatAttachRecords(this._parseIds(id), attributes));
      }
      if (touch) {
        this.touchIfTouching();
      }
    }

    /*Attach a model to the parent using a custom class.*/
    _attachUsingCustomClass(this: Relation & _Self, id: any, attributes: any[]) {
      const records = this._formatAttachRecords(this._parseIds(id), attributes);
      for (const record of records) {
        this.newPivot(record, false).save();
      }
    }

    /*Create an array of records to insert into the pivot table.*/
    _formatAttachRecords(this: Relation & _Self, ids: any[], attributes: any[]) {
      const records       = [];
      const hasTimestamps = this.hasPivotColumn(this.createdAt()) || this.hasPivotColumn(
        this.updatedAt());
      for (const [key, value] of Object.entries(ids)) {
        records.push(this._formatAttachRecord(key, value, attributes, hasTimestamps));
      }
      return records;
    }

    /*Create a full attachment record payload.*/
    _formatAttachRecord(this: Relation & _Self, key: number | string, value: any, attributes: any[],
                        hasTimestamps: boolean) {
      let id;
      [id, attributes] = this._extractAttachIdAndAttributes(key, value, attributes);
      return [...this.baseAttachRecord(id, hasTimestamps), ...this.castAttributes(attributes)];
    }

    /*Get the attach record ID and extra attributes.*/
    _extractAttachIdAndAttributes(this: Relation & _Self, key: any, value: any, attributes: any[]) {
      return isArray(value) ? [key, [...value, ...attributes]] : [value, attributes];
    }

    /*Create a new pivot attachment record.*/
    _baseAttachRecord(this: Relation & _Self, id: number, timed: boolean) {
      let record                   = {};
      record[this.relatedPivotKey] = id;
      record[this.foreignPivotKey] = this.parent[this.parentKey];
      if (timed) {
        record = this._addTimestampsToAttachment(record);
      }
      for (const value of this.pivotValues) {
        record[value['column']] = value['value'];
      }
      return record;
    }

    /*Set the creation and update timestamps on an attach record.*/
    _addTimestampsToAttachment(this: Relation & _Self, record: Record<any, any>, exists = false) {
      let fresh = this.parent.freshTimestamp();
      if (this.using) {
        const pivotModel = new this.using();
        fresh            = fresh.format(pivotModel.getDateFormat());
      }
      if (!exists && this.hasPivotColumn(this.createdAt())) {
        record[this.createdAt()] = fresh;
      }
      if (this.hasPivotColumn(this.updatedAt())) {
        record[this.updatedAt()] = fresh;
      }
      return record;
    }

    /*Determine whether the given column is defined as a pivot column.*/
    public hasPivotColumn(this: Relation & _Self, column: string) {
      return this._pivotColumns.includes(column);
    }

    /*Detach models from the relationship.*/
    public detach(this: Relation & _Self, ids: any = null, touch = true) {
      let results;
      if (this.using && ids.length &&
        !this._pivotWheres.length &&
        !this._pivotWhereIns.length &&
        !this._pivotWhereNulls.length
      ) {
        results = this.detachUsingCustomClass(ids);
      } else {
        const query = this.newPivotQuery();
        if (!isBlank(ids)) {
          ids = this._parseIds(ids);
          if (!ids.length) {
            return 0;
          }
          query.whereIn(this.getQualifiedRelatedPivotKeyName(), /*cast type array*/ ids);
        }
        results = query.delete();
      }
      if (touch) {
        this.touchIfTouching();
      }
      return results;
    }

    /*Detach models from the relationship using a custom class.*/
    _detachUsingCustomClass(this: Relation & _Self, ids: any) {
      let results = 0;
      for (const id of this._parseIds(ids)) {
        results += this.newPivot({
          [this.foreignPivotKey]: this.parent[this.parentKey],
          [this.relatedPivotKey]: id,
        }, true).delete();
      }
      return results;
    }

    /*Get the pivot models that are currently attached.*/
    _getCurrentlyAttachedPivots(this: Relation & _Self,) {
      return this.newPivotQuery().get().map(record => {
        const clazz = this._using; //todo recovery me || Pivot;
        const pivot = clazz.fromRawAttributes(this.parent, /*cast type array*/ record,
          this.getTable(), true);
        return pivot.setPivotKeys(this.foreignPivotKey, this.relatedPivotKey);
      });
    }

    /*Create a new pivot model instance.*/
    public newPivot(this: Relation & _Self, attributes: Record<string, any> = {}, exists = false) {
      const pivot = this.related.newPivot(this.parent, attributes, this.table, exists, this.using);
      return pivot.setPivotKeys(this.foreignPivotKey, this.relatedPivotKey);
    }

    /*Create a new existing pivot model instance.*/
    public newExistingPivot(this: Relation & _Self, attributes: any[] = []) {
      return this.newPivot(attributes, true);
    }

    /*Get a new plain query builder for the pivot table.*/
    public newPivotStatement(this: Relation & _Self,) {
      return this.query.getQuery().newQuery().from(this.table);
    }

    /*Get a new pivot statement for a given "other" ID.*/
    public newPivotStatementForId(this: Relation & _Self, id: any) {
      return this.newPivotQuery().whereIn(this.relatedPivotKey, this._parseIds(id));
    }

    /*Create a new query builder for the pivot table.*/
    public newPivotQuery(this: Relation & _Self,) {
      const query = this.newPivotStatement();
      for (const args of this._pivotWheres) {
        query.where(...args);
      }
      for (const args of this._pivotWhereIns) {
        query.whereIn(...args);
      }
      for (const args of this._pivotWhereNulls) {
        query.whereNull(...args);
      }
      return query.where(this.getQualifiedForeignPivotKeyName(), this.parent[this.parentKey]);
    }

    /*Set the columns on the pivot table to retrieve.*/
    public withPivot(this: /*BelongsToMany*/ any & this, columns: any[] | any, ...cols: any[]) {
      this._pivotColumns = [
        ...this._pivotColumns, ...(isArray(columns) ? columns : arguments)
      ];
      return this;
    }

    /*Get all of the IDs from the given mixed value.*/
    _parseIds(this: Relation & _Self, value: any | any[]) {
      if (value as Model instanceof BaseModel) {
        return [value[this.relatedKey]];
      }
      // if (value instanceof Collection) {
      //   return value.pluck(this.relatedKey).all();
      // }
      // if (value instanceof BaseCollection) {
      //   return value.toArray();
      // }
      return /*cast type array*/ value;
    }

    /*Get the ID from the given mixed value.*/
    _parseId(this: Relation & _Self, value: any) {
      return value as Model instanceof BaseModel ? value[this.relatedKey] : value;
    }

    /*Cast the given keys to integers if they are numeric and string otherwise.*/
    _castKeys(this: Relation & _Self, keys: any[]) {
      return keys.map(v => {
        return this._castKey(v);
      });
    }

    /*Cast the given key to convert to primary key type.*/
    _castKey(this: Relation & _Self, key: any) {
      return this.getTypeSwapValue(this.related.getKeyType(), key);
    }

    /*Cast the given pivot attributes.*/
    _castAttributes(this: Relation & this, attributes: any[]) {
      return this._using ? this.newPivot().fill(attributes).getAttributes() : attributes;
    }

    /*Converts a given value to a given type value.*/
    _getTypeSwapValue(this: Relation & _Self, type: string, value: any) {
      switch (type.toLowerCase()) {
        case 'int':
        case 'integer':
          return /*cast type int*/ value;
        case 'real':
        case 'float':
        case 'double':
          return /*cast type float*/ value;
        case 'string':
          return /*cast type string*/ value;
        default:
          return value;
      }
    }
  };
}
