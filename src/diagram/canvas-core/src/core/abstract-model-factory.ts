/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CanvasEngine } from '../canvas-engine';
import { BaseModel } from '../core-models/base-model';
import { AbstractFactory } from './abstract-factory';

export interface GenerateModelEvent {
  initialConfig?: any;
}

export abstract class AbstractModelFactory<T extends BaseModel = BaseModel, E extends CanvasEngine = CanvasEngine>
  extends AbstractFactory<E> {
  /**
   * Generates new models (the core factory pattern)
   */
  abstract generateModel(event: GenerateModelEvent): T;
}
