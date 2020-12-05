/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CanvasEngine } from '../canvas-engine';
import { FactoryBank } from './factory-bank';

/**
 * Base factory for all the different types of entities.
 * Gets registered with the engine, and is used to generate models
 */
export abstract class AbstractFactory<E extends CanvasEngine = CanvasEngine> {
  /**
   * Couples the factory with the models it generates
   */
  protected type: string;
  /**
   * The engine gets injected when the factory is registered
   */
  protected engine: E;
  protected bank: FactoryBank;

  constructor(type: string) {
    this.type = type;
  }

  setDiagramEngine(engine: E) {
    this.engine = engine;
  }

  setFactoryBank(bank: FactoryBank<any, any>) {
    this.bank = bank;
  }

  getType(): string {
    return this.type;
  }
}
