import { Model } from "Illuminate/Database/Eloquent/Model";
import { SupportsPartialRelations } from "Illuminate/Contracts/Database/Eloquent/SupportsPartialRelations";
import { Model } from "Illuminate/Database/Eloquent/Model";
/*trait*/ export class ComparesRelatedModels {
    /*Determine if the model is the related instance of the relationship.*/
    public is(model: Model | null) {
        var match = !isBlank(model) && this.compareKeys(this.getParentKey(), this.getRelatedKeyFrom(model)) && this.related.getTable() === model.getTable() && this.related.getConnectionName() === model.getConnectionName();
        if (match && this instanceof SupportsPartialRelations && this.isOneOfMany()) {
            return this.query.whereKey(model.getKey()).exists();
        }
        return match;
    }
    /*Determine if the model is not the related instance of the relationship.*/
    public isNot(model: Model | null) {
        return !this.is(model);
    }
    /*Get the value of the parent model's key.*/
    public abstract getParentKey();
    /*Get the value of the model's related key.*/
    protected abstract getRelatedKeyFrom(model: Model);
    /*Compare the parent key with the related key.*/
    protected compareKeys(parentKey: any, relatedKey: any) {
        if (empty(parentKey) || empty(relatedKey)) {
            return false;
        }
        if (is_int(parentKey) || is_int(relatedKey)) {
            return /*cast type int*/ parentKey === /*cast type int*/ relatedKey;
        }
        return parentKey === relatedKey;
    }
}
