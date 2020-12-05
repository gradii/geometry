/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BaseModel } from '../core-models/base-model';
import { AbstractModelFactory, GenerateModelEvent } from './abstract-model-factory';
import { CanvasEngine } from '../canvas-engine';

export interface GenerateWidgetEvent<T extends BaseModel> {
  model: T;
}

/**
 * Further extends the AbstractFactory to add widget generation capability.
 */
export abstract class AbstractReactFactory<T extends BaseModel = BaseModel, E extends CanvasEngine = CanvasEngine>
  extends AbstractModelFactory<T, E> {

  abstract generateModel(event: GenerateModelEvent): T;
  /**
   * Generates React widgets from the model contained in the event object
   */
  abstract generateReactWidget?(event: GenerateWidgetEvent<T>): any; // react dom
}
