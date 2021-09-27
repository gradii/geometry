/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { ColumnDefineAttributes, ColumnDefinition } from './column-definition';


export type ForeignKeyDefinitionAttributes = {
  deferrable: boolean;
  initiallyImmediate: boolean;
  on: string;
  onDelete: string;
  onUpdate: string;
  references: string | string[];
};

export class ForeignKeyDefinition extends ColumnDefinition {
  attributes: ColumnDefineAttributes & ForeignKeyDefinitionAttributes;


  public get deferrable() {
    return this.get('deferrable');
  }

  public get initiallyImmediate() {
    return this.get('initiallyImmediate');
  }

  public get on() {
    return this.get('on');
  }

  public get onDelete() {
    return this.get('onDelete');
  }

  public get onUpdate() {
    return this.get('onUpdate');
  }

  public get references() {
    return this.get('references');
  }

  /**
   * Set the foreign key as deferrable (PostgreSQL)
   */
  withDeferrable(value: boolean = true) {
    this.attributes['deferrable'] = value;
    return this;
  }

  /**
   * Set the default time to check the constraint (PostgreSQL)
   */
  withInitiallyImmediate(value: boolean = true) {
    this.attributes['initiallyImmediate'] = value;
    return this;
  }

  /**
   * Specify the referenced table
   */
  withOn(table: string) {
    this.attributes['on'] = table;
    return this;
  }

  /**
   * Add an ON DELETE action
   */
  withOnDelete(action: string) {
    this.attributes['onDelete'] = action;
    return this;
  }

  /**
   * Add an ON UPDATE action
   */
  withOnUpdate(action: string) {
    this.attributes['onUpdate'] = action;
    return this;
  }

  /**
   * Specify the referenced column(s)
   */
  withReferences(columns: string | string[]) {
    this.attributes['references'] = columns;
    return this;
  }

  /*Indicate that updates should cascade.*/
  public cascadeOnUpdate() {
    return this.onUpdate('cascade');
  }

  /*Indicate that deletes should cascade.*/
  public cascadeOnDelete() {
    return this.onDelete('cascade');
  }

  /*Indicate that deletes should be restricted.*/
  public restrictOnDelete() {
    return this.onDelete('restrict');
  }

  /*Indicate that deletes should set the foreign key value to null.*/
  public nullOnDelete() {
    return this.onDelete('set null');
  }
}
