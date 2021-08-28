import { Collection } from 'Illuminate/Database/Eloquent/Collection';
import { Model } from 'Illuminate/Database/Eloquent/Model';

export class HasOneThrough extends HasManyThrough {
  /*Get the results of the relationship.*/
  public getResults() {
    return this.first() || this.getDefaultFor(this.farParent);
  }

  /*Initialize the relation on a set of models.*/
  public initRelation(models: any[], relation: string) {
    for (let model of models) {
      model.setRelation(relation, this.getDefaultFor(model));
    }
    return models;
  }

  /*Match the eagerly loaded results to their parents.*/
  public match(models: any[], results: Collection, relation: string) {
    var dictionary = this.buildDictionary(results);
    for (let model of models) {
      if (dictionary[key = this.getDictionaryKey(
        model.getAttribute(this.localKey))] !== undefined) {
        var value = dictionary[key];
        model.setRelation(relation, reset(value));
      }
    }
    return models;
  }

  /*Make a new related instance for the given model.*/
  public newRelatedInstanceFor(parent: Model) {
    return this.related.newInstance();
  }
}
