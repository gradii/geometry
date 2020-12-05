/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Rectangle } from '@gradii/diagram/geometry';

export interface ModelGeometryInterface {
  getBoundingBox(): Rectangle;
}
