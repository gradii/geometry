/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import * as _ from 'lodash';
import { CanvasEngine } from '../canvas-engine';
import { BaseEvent, BaseListener, BaseObserver } from '../core/base-observer';
import { Toolkit } from '../toolkit';
import { BaseModel } from './base-model';

export interface BaseEntityEvent<T extends BaseEntity = BaseEntity> extends BaseEvent {
  entity: T;
}

export interface BaseEntityListener<T extends BaseEntity = BaseEntity> extends BaseListener {
  lockChanged(event: BaseEntityEvent<T> & { locked: boolean }): void;
}

export type BaseEntityType = 'node' | 'link' | 'port' | 'point';

export interface BaseEntityOptions {
  id?: string;
  locked?: boolean;
}

export type BaseEntityGenerics = {
  LISTENER: BaseEntityListener;
  OPTIONS: BaseEntityOptions;
};

export interface DeserializeEvent<T extends BaseEntity = BaseEntity> {
  engine: CanvasEngine;
  data: ReturnType<T['serialize']>;

  registerModel(model: BaseModel): any;

  getModel<M extends BaseModel>(id: string): Promise<M>;
}

export class BaseEntity<T extends BaseEntityGenerics = BaseEntityGenerics> extends BaseObserver<T['LISTENER']> {
  protected options: T['OPTIONS'];

  constructor(options: T['OPTIONS'] = {}) {
    super();
    this.options = {
      id: Toolkit.UID(),
      ...options
    };
  }

  getOptions() {
    return this.options;
  }

  getID() {
    return this.options.id;
  }

  doClone(lookupTable: { [s: string]: any } = {}, clone: any) {
    /*noop*/
  }

  clone(lookupTable: { [s: string]: any } = {}) {
    // try and use an existing clone first
    if (lookupTable[this.options.id]) {
      return lookupTable[this.options.id];
    }
    let clone = _.cloneDeep(this);
    clone.options = {
      ...this.options,
      id: Toolkit.UID()
    };
    clone.clearListeners();
    lookupTable[this.options.id] = clone;

    this.doClone(lookupTable, clone);
    return clone;
  }

  clearListeners() {
    this.listeners = {};
  }

  deserialize(event: DeserializeEvent<this>) {
    this.options.id = event.data.id;
    this.options.locked = event.data.locked;
  }

  serialize() {
    return {
      id: this.options.id,
      locked: this.options.locked
    };
  }

  fireEvent<L extends Partial<BaseEntityEvent> & object>(event: L, k: keyof T['LISTENER']) {
    super.fireEvent(
      {
        entity: this,
        ...event
      } as BaseEntityEvent,
      k
    );
  }

  public isLocked(): boolean {
    return this.options.locked;
  }

  public setLocked(locked: boolean = true) {
    this.options.locked = locked;
    this.fireEvent(
      {
        locked: locked
      },
      'lockChanged'
    );
  }
}
