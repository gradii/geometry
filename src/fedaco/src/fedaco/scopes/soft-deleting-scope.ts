/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { FedacoBuilder } from '../fedaco-builder';
import { Model } from '../model';
import { Scope } from '../scope';

// import { Builder } from 'Illuminate/Database/Eloquent/Builder';
// import { Model } from 'Illuminate/Database/Eloquent/Model';
export class SoftDeletingScope implements Scope {
  /*All of the extensions to be added to the builder.*/
  protected extensions: string[] = ['Restore', 'WithTrashed', 'WithoutTrashed', 'OnlyTrashed'];

  /*Apply the scope to a given Eloquent query builder.*/
  public apply(builder: FedacoBuilder, model: Model) {
    builder.whereNull(model.getQualifiedDeletedAtColumn());
  }

  /*Extend the query builder with the needed functions.*/
  public extend(builder: FedacoBuilder) {
    for (let extension of this.extensions) {
      this['"add{$extension}"'](builder);
    }
    builder.onDelete((builder: FedacoBuilder) => {
      let column = this.getDeletedAtColumn(builder);
      return builder.update({});
    });
  }

  /*Get the "deleted at" column for the builder.*/
  protected getDeletedAtColumn(builder: FedacoBuilder) {
    if (count(/*cast type array*/ builder.getQuery().joins) > 0) {
      return builder.getModel().getQualifiedDeletedAtColumn();
    }
    return builder.getModel().getDeletedAtColumn();
  }

  /*Add the restore extension to the builder.*/
  protected addRestore(builder: FedacoBuilder) {
    builder.macro('restore', (builder: FedacoBuilder) => {
      builder.withTrashed();
      return builder.update({});
    });
  }

  /*Add the with-trashed extension to the builder.*/
  protected addWithTrashed(builder: FedacoBuilder) {
    builder.macro('withTrashed', (builder: FedacoBuilder, withTrashed = true) => {
      if (!withTrashed) {
        return builder.withoutTrashed();
      }
      return builder.withoutGlobalScope(this);
    });
  }

  /*Add the without-trashed extension to the builder.*/
  protected addWithoutTrashed(builder: FedacoBuilder) {
    builder.macro('withoutTrashed', (builder: FedacoBuilder) => {
      let model = builder.getModel();
      builder.withoutGlobalScope(this).whereNull(model.getQualifiedDeletedAtColumn());
      return builder;
    });
  }

  /*Add the only-trashed extension to the builder.*/
  protected addOnlyTrashed(builder: FedacoBuilder) {
    builder.macro('onlyTrashed', (builder: FedacoBuilder) => {
      let model = builder.getModel();
      builder.withoutGlobalScope(this).whereNotNull(model.getQualifiedDeletedAtColumn());
      return builder;
    });
  }
}
