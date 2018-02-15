import { FormSchema } from './form-schema';

export const FORM_SCHEMA_SPEC_VER_1 = 1;
export const FORM_SCHEMA_SPEC_VER_2 = 2;
export const FORM_SCHEMA_SPEC_VER_3 = 3;

export class FormSchemaSpec {
  private _schema = new FormSchema();

  public constructor(private _version: number, schema?: FormSchema) {}

  public get version() {
    return this._version;
  }

  public set schema(schema) {
    this._schema = schema;
  }

  public get schema() {
    return this._schema;
  }

  public getSchema() {
    return this._schema;
  }

  getFormGroup() {}
}
