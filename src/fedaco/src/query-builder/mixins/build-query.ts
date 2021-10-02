/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { isBlank } from '@gradii/check-type';
import { last } from 'ramda';
import { BehaviorSubject, EMPTY, from, Observable, Subscriber } from 'rxjs';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { Model } from '../../fedaco/model';
import { Constructor } from '../../helper/constructor';
import { QueryBuilder } from '../query-builder';

export interface BuildQueries {

  chunkById(count: number,
            column?: string,
            alias?: string): Observable<any>;

  first(columns?: any[] | string): Promise<Model | /*object |*/ any | null>;

  when(condition: boolean, callback: (q: this, condition: boolean) => any,
       defaultCallback?: Function): this;

  tap(callback: (q: this, condition: boolean) => any): this;

  unless(value: any, callback: Function, _default?: Function): this;
}

export type BuildQueriesCtor = Constructor<BuildQueries>;


export function mixinBuildQueries<T extends Constructor<any>>(base: T): BuildQueriesCtor & T {

  return class _Self extends base {

    public chunk(count: number, callback: Function) {

    }

    public each(callback: Function, count: number = 1000) {

    }

    /**
     * Chunk the results of a query by comparing IDs.
     * not use callback version. use callback can wait callback finish then emit next
     */
    public chunkById(this: QueryBuilder & _Self, count: number,
                     column?: string,
                     alias?: string): Observable<any> {
      if (!(count > 0)) {
        return EMPTY;
      }
      column      = column ?? this.defaultKeyName();
      alias       = alias ?? column;
      const clone = this.clone();

      return new Observable((observer: Subscriber<any>) => {
        let lastId: number;
        const subject = new BehaviorSubject(1);
        subject.pipe(
          concatMap((page: number) => {
            return from(
              (clone as QueryBuilder)
                .forPageAfterId(count, lastId, column).get()
            ).pipe(
              tap((results: any[]) => {
                if (!results || results.length == 0) {
                  subject.complete();
                  observer.complete();
                } else {
                  observer.next({results, page});

                  lastId = last(results)[alias];

                  if (isBlank(lastId)) {
                    throw new Error(
                      `RuntimeException The chunkById operation was aborted` +
                      ` because the [${alias}] column is not present in the query result.`);
                  }
                }
              }),
              tap((results) => {
                if (results.length === count && count > 0) {
                  subject.next(page + 1);
                } else {
                  subject.complete();
                  observer.complete();
                }
              })
            );
          }),

          catchError((err, caught) => {
            observer.error(err);
            observer.complete();
            return EMPTY;
          })
        ).subscribe();

        return () => {
          subject.complete();
        };
      });
    }

    public eachById(callback: Function, count: number                  = 1000,
                    column: string | null = null, alias: string | null = null) {
    }

    /*Execute the query and get the first result.*/
    public async first(this: QueryBuilder & _Self, columns: any[] | string = ['*']) {
      // return this.take(1).get(columns).first();
      // todo
      const results = await this.take(1).get(columns);
      return results.pop();
    }

    public when(condition: boolean, callback: (q: this, condition: boolean) => any,
                defaultCallback?: Function): this {
      if (condition) {
        return callback(this, condition) ?? this;
      }

      if (defaultCallback) {
        return defaultCallback(this, condition) ?? this;
      }
      return this;
    }

    public tap(callback: (q: this, condition: boolean) => any) {
      return this.when(true, callback);
    }

    public unless(value: any, callback: Function, _default: Function = null) {
      if (!value) {
        return callback(this, value) || this;
      } else if (_default) {
        return _default(this, value) || this;
      }
      return this;
    }


  };
}
