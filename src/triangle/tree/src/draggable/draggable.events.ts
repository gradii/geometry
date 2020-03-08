/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ElementRef } from '@angular/core';
import { CapturedNode } from './captured-node';

export class NodeDraggableEvent {
  constructor(public captured: CapturedNode, public target: ElementRef) {}
}
