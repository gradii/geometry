/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import { Rgb } from './rgb';

export abstract class Color {

  public abstract rgb(): Rgb;

  public displayable() {
    return this.rgb().displayable();
  }

  public hex() {
    return this.rgb().hex();
  }

  public toString() {
    return this.rgb() + '';
  }
}
