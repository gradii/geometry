/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Model } from 'Illuminate/Database/Eloquent/Model';
import { Builder } from 'Illuminate/Database/Eloquent/Builder';
import { Model } from 'Illuminate/Database/Eloquent/Model';
import { Builder } from 'Illuminate/Database/Eloquent/Builder';
export class Pivot extends Model {
    /*The parent model of the relationship.*/
    protected parent: Model;
    /*The name of the foreign key column.*/
    protected foreignKey: string;
    /*The name of the "other key" column.*/
    protected otherKey: string;
    /*The attributes that aren't mass assignable.*/
    protected guarded: any[] = [];
    /*Create a new pivot model instance.*/
    public constructor(parent: Model, attributes: any[], table: string, exists: boolean = false) {
        super.__construct();
        this.setTable(table);
        this.setConnection(parent.getConnectionName());
        this.forceFill(attributes);
        this.syncOriginal();
        this.parent = parent;
        this.exists = exists;
        this.timestamps = this.hasTimestampAttributes();
    }
    /*Create a new pivot model from raw values returned from a query.*/
    public static fromRawAttributes(parent: Model, attributes: any[], table: string, exists: boolean = false) {
        let instance = new Pivot(parent, attributes, table, exists);
        instance.setRawAttributes(attributes, true);
        return instance;
    }
    /*Set the keys for a save update query.*/
    protected setKeysForSaveQuery(query: Builder) {
        query.where(this.foreignKey, this.getAttribute(this.foreignKey));
        return query.where(this.otherKey, this.getAttribute(this.otherKey));
    }
    /*Delete the pivot model record from the database.*/
    public delete() {
        return this.getDeleteQuery().delete();
    }
    /*Get the query builder for a delete operation on the pivot.*/
    protected getDeleteQuery() {
        let foreign = this.getAttribute(this.foreignKey);
        let query = this.newQuery().where(this.foreignKey, foreign);
        return query.where(this.otherKey, this.getAttribute(this.otherKey));
    }
    /*Get the foreign key column name.*/
    public getForeignKey() {
        return this.foreignKey;
    }
    /*Get the "other key" column name.*/
    public getOtherKey() {
        return this.otherKey;
    }
    /*Set the key names for the pivot model instance.*/
    public setPivotKeys(foreignKey: string, otherKey: string) {
        this.foreignKey = foreignKey;
        this.otherKey = otherKey;
        return this;
    }
    /*Determine if the pivot model has timestamp attributes.*/
    public hasTimestampAttributes() {
        return array_key_exists(this.getCreatedAtColumn(), this.attributes);
    }
    /*Get the name of the "created at" column.*/
    public getCreatedAtColumn() {
        return this.parent.getCreatedAtColumn();
    }
    /*Get the name of the "updated at" column.*/
    public getUpdatedAtColumn() {
        return this.parent.getUpdatedAtColumn();
    }
}
