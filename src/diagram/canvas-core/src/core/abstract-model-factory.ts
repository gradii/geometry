/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AbstractFactory } from './abstract-factory';
import { BaseModel } from '../core-models/base-model';
import { CanvasEngine } from '../canvas-engine';

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
