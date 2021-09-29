/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


/*Object representation of a database column.*/
export class Column {
  /**/
  protected _type: Type;
  /**/
  protected _length: number | null = null;
  /**/
  protected _precision: number = 10;
  /**/
  protected _scale: number = 0;
  /**/
  protected _unsigned: boolean = false;
  /**/
  protected _fixed: boolean = false;
  /**/
  protected _notnull: boolean = true;
  /**/
  protected _default: string | null = null;
  /**/
  protected _autoincrement: boolean = false;
  /**/
  protected _platformOptions: any[] = [];
  /**/
  protected _columnDefinition: string | null = null;
  /**/
  protected _comment: string | null = null;
  /**/
  protected _customSchemaOptions: any[] = [];

  /*Creates a new Column.*/
  public constructor(columnName: string, type, options: any[] = []) {
    super();
    this._setName(columnName);
    this.setType(type);
    this.setOptions(options);
  }

  /**/
  public setOptions(options: any[]) {
    for (const [name, value] of Object.entries(options)) {
      const method = 'set' + name;

      if (typeof this[method] !== 'function') {
        trigger_error(`The "${name}" column option is not supported, setting it is deprecated and will cause an error in Doctrine DBAL 3.0`,
          E_USER_DEPRECATED);
        continue;
      }
      this[method](value);
    }
    return this;
  }

  /**/
  public setType(type) {
    this._type = type;
    return this;
  }

  /**/
  public setLength(length: number | null) {
    if (length !== null) {
      this._length =
        // cast type int
        length;
    } else {
      this._length = null;
    }
    return this;
  }

  /**/
  public setPrecision(precision: number) {
    if (!is_numeric(precision)) {
      const precision = 10;
    }
    this._precision =
      // cast type int
      precision;
    return this;
  }

  /**/
  public setScale(scale: number) {
    if (!is_numeric(scale)) {
      const scale = 0;
    }
    this._scale =
      // cast type int
      scale;
    return this;
  }

  /**/
  public setUnsigned(unsigned: boolean) {
    this._unsigned =
      // cast type bool
      unsigned;
    return this;
  }

  /**/
  public setFixed(fixed: boolean) {
    this._fixed =
      // cast type bool
      fixed;
    return this;
  }

  /**/
  public setNotnull(notnull: boolean) {
    this._notnull =
      // cast type bool
      notnull;
    return this;
  }

  /**/
  public setDefault(_default: any) {
    this._default = _default;
    return this;
  }

  /**/
  public setPlatformOptions(platformOptions: any[]) {
    this._platformOptions = platformOptions;
    return this;
  }

  /**/
  public setPlatformOption(name: string, value: any) {
    this._platformOptions[name] = value;
    return this;
  }

  /**/
  public setColumnDefinition(value: string) {
    this._columnDefinition = value;
    return this;
  }

  /**/
  public getType() {
    return this._type;
  }

  /**/
  public getLength() {
    return this._length;
  }

  /**/
  public getPrecision() {
    return this._precision;
  }

  /**/
  public getScale() {
    return this._scale;
  }

  /**/
  public getUnsigned() {
    return this._unsigned;
  }

  /**/
  public getFixed() {
    return this._fixed;
  }

  /**/
  public getNotnull() {
    return this._notnull;
  }

  /**/
  public getDefault() {
    return this._default;
  }

  /**/
  public getPlatformOptions() {
    return this._platformOptions;
  }

  /**/
  public hasPlatformOption(name: string) {
    return this._platformOptions[name] !== undefined;
  }

  /**/
  public getPlatformOption(name: string) {
    return this._platformOptions[name];
  }

  /**/
  public getColumnDefinition() {
    return this._columnDefinition;
  }

  /**/
  public getAutoincrement() {
    return this._autoincrement;
  }

  /**/
  public setAutoincrement(flag: boolean) {
    this._autoincrement = flag;
    return this;
  }

  /**/
  public setComment(comment: string | null) {
    this._comment = comment;
    return this;
  }

  /**/
  public getComment() {
    return this._comment;
  }

  /**/
  public setCustomSchemaOption(name: string, value: any) {
    this._customSchemaOptions[name] = value;
    return this;
  }

  /**/
  public hasCustomSchemaOption(name: string) {
    return this._customSchemaOptions[name] !== undefined;
  }

  /**/
  public getCustomSchemaOption(name: string) {
    return this._customSchemaOptions[name];
  }

  /**/
  public setCustomSchemaOptions(customSchemaOptions: any[]) {
    this._customSchemaOptions = customSchemaOptions;
    return this;
  }

  /**/
  public getCustomSchemaOptions() {
    return this._customSchemaOptions;
  }

  /**/
  public toArray() {
    return {
      ...{
        name            : this._name,
        type            : this._type,
        default         : this._default,
        notnull         : this._notnull,
        length          : this._length,
        precision       : this._precision,
        scale           : this._scale,
        fixed           : this._fixed,
        unsigned        : this._unsigned,
        autoincrement   : this._autoincrement,
        columnDefinition: this._columnDefinition,
        comment         : this._comment
      },
      ...this._platformOptions,
      ...this._customSchemaOptions
    };
  }
}
