import { Collection } from "Illuminate/Support/Collection";
import { Model } from "Illuminate/Database/Eloquent/Model";
import { Collection } from "Illuminate/Database/Eloquent/Collection";
import { Model } from "Illuminate/Database/Eloquent/Model";
import { Pivot } from "Illuminate/Database/Eloquent/Relations/Pivot";
import { Collection as BaseCollection } from "Illuminate/Support/Collection";
/*trait*/ export class InteractsWithPivotTable {
    /*Toggles a model (or models) from the parent.
    
    Each existing model is detached, and non existing ones are attached.*/
    public toggle(ids: any, touch: boolean = true) {
        var changes = {
            "attached": [],
            "detached": []
        };
        var records = this.formatRecordsList(this.parseIds(ids));
        var detach = array_values(array_intersect(this.newPivotQuery().pluck(this.relatedPivotKey).all(), array_keys(records)));
        if (count(detach) > 0) {
            this.detach(detach, false);
            changes["detached"] = this.castKeys(detach);
        }
        var attach = array_diff_key(records, array_flip(detach));
        if (count(attach) > 0) {
            this.attach(attach, [], false);
            changes["attached"] = array_keys(attach);
        }
        if (touch && (count(changes["attached"]) || count(changes["detached"]))) {
            this.touchIfTouching();
        }
        return changes;
    }
    /*Sync the intermediate tables with a list of IDs without detaching.*/
    public syncWithoutDetaching(ids: Collection | Model | any[]) {
        return this.sync(ids, false);
    }
    /*Sync the intermediate tables with a list of IDs or collection of models.*/
    public sync(ids: Collection | Model | any[], detaching: boolean = true) {
        var changes = {
            "attached": [],
            "detached": [],
            "updated": []
        };
        var current = this.getCurrentlyAttachedPivots().pluck(this.relatedPivotKey).all();
        var detach = array_diff(current, array_keys(records = this.formatRecordsList(this.parseIds(ids))));
        if (detaching && count(detach) > 0) {
            this.detach(detach);
            changes["detached"] = this.castKeys(detach);
        }
        var changes = [...changes, ...this.attachNew(records, current, false)];
        if (count(changes["attached"]) || count(changes["updated"]) || count(changes["detached"])) {
            this.touchIfTouching();
        }
        return changes;
    }
    /*Sync the intermediate tables with a list of IDs or collection of models with the given pivot values.*/
    public syncWithPivotValues(ids: Collection | Model | any[], values: any[], detaching: boolean = true) {
        return this.sync(collect(this.parseIds(ids)).mapWithKeys(id => {
            return {};
        }), detaching);
    }
    /*Format the sync / toggle record list so that it is keyed by ID.*/
    protected formatRecordsList(records: any[]) {
        return collect(records).mapWithKeys((attributes, id) => {
            if (!is_array(attributes)) {
                const [id, attributes] = [attributes, []];
            }
            return {};
        }).all();
    }
    /*Attach all of the records that aren't in the given current records.*/
    protected attachNew(records: any[], current: any[], touch: boolean = true) {
        var changes = {
            "attached": [],
            "updated": []
        };
        for (let [id, attributes] of Object.entries(records)) {
            if (!in_array(id, current)) {
                this.attach(id, attributes, touch);
                changes["attached"].push(this.castKey(id));
            }
            else if (count(attributes) > 0 && this.updateExistingPivot(id, attributes, touch)) {
                changes["updated"].push(this.castKey(id));
            }
        }
        return changes;
    }
    /*Update an existing pivot record on the table.*/
    public updateExistingPivot(id: any, attributes: any[], touch: boolean = true) {
        if (this.using && empty(this.pivotWheres) && empty(this.pivotWhereIns) && empty(this.pivotWhereNulls)) {
            return this.updateExistingPivotUsingCustomClass(id, attributes, touch);
        }
        if (in_array(this.updatedAt(), this.pivotColumns)) {
            var attributes = this.addTimestampsToAttachment(attributes, true);
        }
        var updated = this.newPivotStatementForId(this.parseId(id)).update(this.castAttributes(attributes));
        if (touch) {
            this.touchIfTouching();
        }
        return updated;
    }
    /*Update an existing pivot record on the table via a custom class.*/
    protected updateExistingPivotUsingCustomClass(id: any, attributes: any[], touch: boolean) {
        var pivot = this.getCurrentlyAttachedPivots().where(this.foreignPivotKey, this.parent[this.parentKey]).where(this.relatedPivotKey, this.parseId(id)).first();
        var updated = pivot ? pivot.fill(attributes).isDirty() : false;
        if (updated) {
            pivot.save();
        }
        if (touch) {
            this.touchIfTouching();
        }
        return /*cast type int*/ updated;
    }
    /*Attach a model to the parent.*/
    public attach(id: any, attributes: any[] = [], touch: boolean = true) {
        if (this.using) {
            this.attachUsingCustomClass(id, attributes);
        }
        else {
            this.newPivotStatement().insert(this.formatAttachRecords(this.parseIds(id), attributes));
        }
        if (touch) {
            this.touchIfTouching();
        }
    }
    /*Attach a model to the parent using a custom class.*/
    protected attachUsingCustomClass(id: any, attributes: any[]) {
        var records = this.formatAttachRecords(this.parseIds(id), attributes);
        for (let record of records) {
            this.newPivot(record, false).save();
        }
    }
    /*Create an array of records to insert into the pivot table.*/
    protected formatAttachRecords(ids: any[], attributes: any[]) {
        var records = [];
        var hasTimestamps = this.hasPivotColumn(this.createdAt()) || this.hasPivotColumn(this.updatedAt());
        for (let [key, value] of Object.entries(ids)) {
            records.push(this.formatAttachRecord(key, value, attributes, hasTimestamps));
        }
        return records;
    }
    /*Create a full attachment record payload.*/
    protected formatAttachRecord(key: number, value: any, attributes: any[], hasTimestamps: boolean) {
        const [id, attributes] = this.extractAttachIdAndAttributes(key, value, attributes);
        return [...this.baseAttachRecord(id, hasTimestamps), ...this.castAttributes(attributes)];
    }
    /*Get the attach record ID and extra attributes.*/
    protected extractAttachIdAndAttributes(key: any, value: any, attributes: any[]) {
        return is_array(value) ? [key, [...value, ...attributes]] : [value, attributes];
    }
    /*Create a new pivot attachment record.*/
    protected baseAttachRecord(id: number, timed: boolean) {
        record[this.relatedPivotKey] = id;
        record[this.foreignPivotKey] = this.parent[this.parentKey];
        if (timed) {
            var record = this.addTimestampsToAttachment(record);
        }
        for (let value of this.pivotValues) {
            record[value["column"]] = value["value"];
        }
        return record;
    }
    /*Set the creation and update timestamps on an attach record.*/
    protected addTimestampsToAttachment(record: any[], exists: boolean = false) {
        var fresh = this.parent.freshTimestamp();
        if (this.using) {
            var pivotModel = new this.using();
            var fresh = fresh.format(pivotModel.getDateFormat());
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
    public hasPivotColumn(column: string) {
        return in_array(column, this.pivotColumns);
    }
    /*Detach models from the relationship.*/
    public detach(ids: any = null, touch: boolean = true) {
        if (this.using && !empty(ids) && empty(this.pivotWheres) && empty(this.pivotWhereIns) && empty(this.pivotWhereNulls)) {
            var results = this.detachUsingCustomClass(ids);
        }
        else {
            var query = this.newPivotQuery();
            if (!isBlank(ids)) {
                var ids = this.parseIds(ids);
                if (empty(ids)) {
                    return 0;
                }
                query.whereIn(this.getQualifiedRelatedPivotKeyName(), /*cast type array*/ ids);
            }
            var results = query.delete();
        }
        if (touch) {
            this.touchIfTouching();
        }
        return results;
    }
    /*Detach models from the relationship using a custom class.*/
    protected detachUsingCustomClass(ids: any) {
        var results = 0;
        for (let id of this.parseIds(ids)) {
            results += this.newPivot({}, true).delete();
        }
        return results;
    }
    /*Get the pivot models that are currently attached.*/
    protected getCurrentlyAttachedPivots() {
        return this.newPivotQuery().get().map(record => {
            var clazz = this.using || Pivot;
            var pivot = clazz.fromRawAttributes(this.parent, /*cast type array*/ record, this.getTable(), true);
            return pivot.setPivotKeys(this.foreignPivotKey, this.relatedPivotKey);
        });
    }
    /*Create a new pivot model instance.*/
    public newPivot(attributes: any[] = [], exists: boolean = false) {
        var pivot = this.related.newPivot(this.parent, attributes, this.table, exists, this.using);
        return pivot.setPivotKeys(this.foreignPivotKey, this.relatedPivotKey);
    }
    /*Create a new existing pivot model instance.*/
    public newExistingPivot(attributes: any[] = []) {
        return this.newPivot(attributes, true);
    }
    /*Get a new plain query builder for the pivot table.*/
    public newPivotStatement() {
        return this.query.getQuery().newQuery().from(this.table);
    }
    /*Get a new pivot statement for a given "other" ID.*/
    public newPivotStatementForId(id: any) {
        return this.newPivotQuery().whereIn(this.relatedPivotKey, this.parseIds(id));
    }
    /*Create a new query builder for the pivot table.*/
    public newPivotQuery() {
        var query = this.newPivotStatement();
        for (let arguments of this.pivotWheres) {
            query.where(());
        }
        for (let arguments of this.pivotWhereIns) {
            query.whereIn(());
        }
        for (let arguments of this.pivotWhereNulls) {
            query.whereNull(());
        }
        return query.where(this.getQualifiedForeignPivotKeyName(), this.parent[this.parentKey]);
    }
    /*Set the columns on the pivot table to retrieve.*/
    public withPivot(columns: any[] | any) {
        this.pivotColumns = [...this.pivotColumns, ...(is_array(columns) ? columns : func_get_args())];
        return this;
    }
    /*Get all of the IDs from the given mixed value.*/
    protected parseIds(value: any) {
        if (value instanceof Model) {
            return [value[this.relatedKey]];
        }
        if (value instanceof Collection) {
            return value.pluck(this.relatedKey).all();
        }
        if (value instanceof BaseCollection) {
            return value.toArray();
        }
        return /*cast type array*/ value;
    }
    /*Get the ID from the given mixed value.*/
    protected parseId(value: any) {
        return value instanceof Model ? value[this.relatedKey] : value;
    }
    /*Cast the given keys to integers if they are numeric and string otherwise.*/
    protected castKeys(keys: any[]) {
        return array_map(v => {
            return this.castKey(v);
        }, keys);
    }
    /*Cast the given key to convert to primary key type.*/
    protected castKey(key: any) {
        return this.getTypeSwapValue(this.related.getKeyType(), key);
    }
    /*Cast the given pivot attributes.*/
    protected castAttributes(attributes: any[]) {
        return this.using ? this.newPivot().fill(attributes).getAttributes() : attributes;
    }
    /*Converts a given value to a given type value.*/
    protected getTypeSwapValue(type: string, value: any) {
        switch (type.toLowerCase()) {
            case "int":
            case "integer": return /*cast type int*/ value;
            case "real":
            case "float":
            case "double": return /*cast type float*/ value;
            case "string": return /*cast type string*/ value;
            default: return value;
        }
    }
}
