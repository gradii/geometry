/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


export class BaseGrammar {
  /*The grammar table prefix.*/
  protected tablePrefix: string = '';

  /*Wrap an array of values.*/
  public wrapArray(values: any[]) {
    return values.map(it => this.wrap(it));
  }

  /*Wrap a table in keyword identifiers.*/
  public wrapTable(table: Expression | string) {
    if (!this.isExpression(table)) {
      return this.wrap(this.tablePrefix + table, true);
    }
    return this.getValue(table);
  }

  /*Wrap a value in keyword identifiers.*/
  public wrap(value: Expression | string, prefixAlias: boolean = false) {
    if (this.isExpression(value)) {
      return this.getValue(value);
    }
    if (value.includes(' as ')) {
      return this.wrapAliasedValue(value, prefixAlias);
    }
    if (this.isJsonSelector(value)) {
      return this.wrapJsonSelector(value);
    }
    return this.wrapSegments(value.split('.'));
  }

  /*Wrap a value that has an alias.*/
  protected wrapAliasedValue(value: string, prefixAlias: boolean = false) {
    var segments = preg_split('/\\s+as\\s+/i', value);
    if (prefixAlias) {
      segments[1] = this.tablePrefix + segments[1];
    }
    return this.wrap(segments[0]) + ' as ' + this.wrapValue(segments[1]);
  }

  /*Wrap the given value segments.*/
  protected wrapSegments(segments: any[]) {
    return collect(segments).map((segment, key) => {
      return key == 0 && count(segments) > 1 ? this.wrapTable(segment) : this.wrapValue(segment);
    }).implode('.');
  }

  /*Wrap a single string in keyword identifiers.*/
  protected wrapValue(value: string) {
    if (value !== '*') {
      return '"' + str_replace('"', '""', value) + '"';
    }
    return value;
  }

  /*Wrap the given JSON selector.*/
  protected wrapJsonSelector(value: string) {
    throw new Error('RuntimeException This database engine does not support JSON operations.');
  }

  /*Determine if the given string is a JSON selector.*/
  protected isJsonSelector(value: string) {
    return value.includes('->');
  }

  /*Convert an array of column names into a delimited string.*/
  public columnize(columns: any[]) {
    return array_map([this, 'wrap'], columns).join(', ');
  }

  /*Create query parameter place-holders for an array.*/
  public parameterize(values: any[]) {
    return array_map([this, 'parameter'], values).join(', ');
  }

  /*Get the appropriate query parameter place-holder for a value.*/
  public parameter(value: any) {
    return this.isExpression(value) ? this.getValue(value) : '?';
  }

  /*Quote the given string literal.*/
  public quoteString(value: string | any[]) {
    if (is_array(value)) {
      return array_map([this, __FUNCTION__], value).join(', ');
    }
    return '"\'$value\'"';
  }

  /*Determine if the given value is a raw expression.*/
  public isExpression(value: any) {
    return value instanceof Expression;
  }

  /*Get the value of a raw expression.*/
  public getValue(expression: Expression) {
    return expression.getValue();
  }

  /*Get the format for database stored dates.*/
  public getDateFormat() {
    return 'yyyy-MM-dd HH:mm:ss';
  }

  /*Get the grammar's table prefix.*/
  public getTablePrefix() {
    return this.tablePrefix;
  }

  /*Set the grammar's table prefix.*/
  public setTablePrefix(prefix: string) {
    this.tablePrefix = prefix;
    return this;
  }
}
