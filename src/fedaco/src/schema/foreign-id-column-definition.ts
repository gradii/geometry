/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { plural } from '../helper/pluralize';
import { Blueprint } from './blueprint';
import { ColumnDefinition } from './column-definition';

export class ForeignIdColumnDefinition extends ColumnDefinition {
  // public name: string;
  /*The schema builder blueprint instance.*/
  protected blueprint: Blueprint;

  /*Create a new foreign ID column definition.*/
  public constructor(blueprint: Blueprint, attributes: any = {}) {
    super(attributes);
    this.blueprint = blueprint;
  }

  /*Create a foreign key constraint on this column referencing the "id" column of the conventionally related table.*/
  public constrained(table: string | null = null, column: string = 'id') {
    return this.references(column).on(table ??
      plural(this.name.replace('_' + column, '')));
  }

  /*Specify which column this foreign ID references on another table.*/
  public references(column: string) {
    return this.blueprint.foreign(this.name).references(column);
  }
}
