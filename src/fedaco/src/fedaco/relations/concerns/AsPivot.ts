import { Model } from "Illuminate/Database/Eloquent/Model";
import { Builder } from "Illuminate/Database/Eloquent/Builder";
import { Builder } from "Illuminate/Database/Eloquent/Builder";
import { Model } from "Illuminate/Database/Eloquent/Model";
import { Str } from "Illuminate/Support/Str";
/*trait*/ export class AsPivot {
    /*The parent model of the relationship.*/
    public pivotParent: Model;
    /*The name of the foreign key column.*/
    protected foreignKey: string;
    /*The name of the "other key" column.*/
    protected relatedKey: string;
    /*Create a new pivot model instance.*/
    public static fromAttributes(parent: Model, attributes: any[], table: string, exists: boolean = false) {
        var instance = new AsPivot();
        instance.timestamps = instance.hasTimestampAttributes(attributes);
        instance.setConnection(parent.getConnectionName()).setTable(table).forceFill(attributes).syncOriginal();
        instance.pivotParent = parent;
        instance.exists = exists;
        return instance;
    }
    /*Create a new pivot model from raw values returned from a query.*/
    public static fromRawAttributes(parent: Model, attributes: any[], table: string, exists: boolean = false) {
        var instance = AsPivot.fromAttributes(parent, [], table, exists);
        instance.timestamps = instance.hasTimestampAttributes(attributes);
        instance.setRawAttributes(attributes, exists);
        return instance;
    }
    /*Set the keys for a select query.*/
    protected setKeysForSelectQuery(query: Builder) {
        if (this.attributes[this.getKeyName()] !== undefined) {
            return super.setKeysForSelectQuery(query);
        }
        query.where(this.foreignKey, this.getOriginal(this.foreignKey, this.getAttribute(this.foreignKey)));
        return query.where(this.relatedKey, this.getOriginal(this.relatedKey, this.getAttribute(this.relatedKey)));
    }
    /*Set the keys for a save update query.*/
    protected setKeysForSaveQuery(query: Builder) {
        return this.setKeysForSelectQuery(query);
    }
    /*Delete the pivot model record from the database.*/
    public delete() {
        if (this.attributes[this.getKeyName()] !== undefined) {
            return /*cast type int*/ super.delete();
        }
        if (this.fireModelEvent("deleting") === false) {
            return 0;
        }
        this.touchOwners();
        return tap(this.getDeleteQuery().delete(), () => {
            this.exists = false;
            this.fireModelEvent("deleted", false);
        });
    }
    /*Get the query builder for a delete operation on the pivot.*/
    protected getDeleteQuery() {
        return this.newQueryWithoutRelationships().where({});
    }
    /*Get the table associated with the model.*/
    public getTable() {
        if (!(this.table !== undefined)) {
            this.setTable(str_replace("\\", "", Str.snake(Str.singular(class_basename(this)))));
        }
        return this.table;
    }
    /*Get the foreign key column name.*/
    public getForeignKey() {
        return this.foreignKey;
    }
    /*Get the "related key" column name.*/
    public getRelatedKey() {
        return this.relatedKey;
    }
    /*Get the "related key" column name.*/
    public getOtherKey() {
        return this.getRelatedKey();
    }
    /*Set the key names for the pivot model instance.*/
    public setPivotKeys(foreignKey: string, relatedKey: string) {
        this.foreignKey = foreignKey;
        this.relatedKey = relatedKey;
        return this;
    }
    /*Determine if the pivot model or given attributes has timestamp attributes.*/
    public hasTimestampAttributes(attributes: any[] | null = null) {
        return array_key_exists(this.getCreatedAtColumn(), attributes ?? this.attributes);
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
        if (this.attributes[this.getKeyName()] !== undefined) {
            return this.getKey();
        }
        return `${this.foreignKey}:${this.getAttribute(this.foreignKey)}:${this.relatedKey}:${this.getAttribute(this.relatedKey)}`;
    }
    /*Get a new query to restore one or more models by their queueable IDs.*/
    public newQueryForRestoration(ids: number[] | string[] | string) {
        if (is_array(ids)) {
            return this.newQueryForCollectionRestoration(ids);
        }
        if (!Str.contains(ids, ":")) {
            return super.newQueryForRestoration(ids);
        }
        var segments = ids.split(":");
        return this.newQueryWithoutScopes().where(segments[0], segments[1]).where(segments[2], segments[3]);
    }
    /*Get a new query to restore multiple models by their queueable IDs.*/
    protected newQueryForCollectionRestoration(ids: number[] | string[]) {
        var ids = array_values(ids);
        if (!Str.contains(ids[0], ":")) {
            return super.newQueryForRestoration(ids);
        }
        var query = this.newQueryWithoutScopes();
        for (let id of ids) {
            var segments = id.split(":");
            query.orWhere(query => {
                return query.where(segments[0], segments[1]).where(segments[2], segments[3]);
            });
        }
        return query;
    }
    /*Unset all the loaded relations for the instance.*/
    public unsetRelations() {
        this.pivotParent = null;
        this.relations = [];
        return this;
    }
}
