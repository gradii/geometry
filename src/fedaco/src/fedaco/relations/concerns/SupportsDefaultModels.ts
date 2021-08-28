import { Model } from "Illuminate/Database/Eloquent/Model";
import { Model } from "Illuminate/Database/Eloquent/Model";
/*trait*/ export class SupportsDefaultModels {
    /*Indicates if a default model instance should be used.
    
    Alternatively, may be a Closure or array.*/
    protected withDefault: Function | any[] | boolean;
    /*Make a new related instance for the given model.*/
    protected abstract newRelatedInstanceFor(parent: Model);
    /*Return a new model instance in case the relationship does not exist.*/
    public withDefault(callback: Function | any[] | boolean = true) {
        this.withDefault = callback;
        return this;
    }
    /*Get the default value for this relation.*/
    protected getDefaultFor(parent: Model) {
        if (!this.withDefault) {
            return;
        }
        var instance = this.newRelatedInstanceFor(parent);
        if (is_callable(this.withDefault)) {
            return call_user_func(this.withDefault, instance, parent) || instance;
        }
        if (is_array(this.withDefault)) {
            instance.forceFill(this.withDefault);
        }
        return instance;
    }
}
