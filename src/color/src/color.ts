/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Rgb } from './rgb';

export abstract class Color {

  public abstract rgb(): Rgb;

  public displayable():boolean {
    return this.rgb().displayable();
  }

  public hex() {
    return this.rgb().hex();
  }

  public toString() {
    return this.rgb() + '';
  }
}
