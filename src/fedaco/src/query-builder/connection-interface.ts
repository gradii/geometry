/**
 *
 */
export interface ConnectionInterface {
  select(sql: string, bindings: any[], readConnection: boolean)
  insert(sql: string, bindings: any[])
}
