/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CapturedNode } from './captured-node';
import { NodeDraggableEvent } from './draggable.events';

@Injectable()
export class NodeDraggableService {
  draggableNodeEvents$: Subject<NodeDraggableEvent> = new Subject<NodeDraggableEvent>();

  private capturedNode: CapturedNode;

  fireNodeDragged(captured: CapturedNode, target: ElementRef): void {
    if (!captured.tree || captured.tree.isStatic()) {
      return;
    }

    this.draggableNodeEvents$.next(new NodeDraggableEvent(captured, target));
  }

  captureNode(node: CapturedNode): void {
    this.capturedNode = node;
  }

  getCapturedNode(): CapturedNode {
    return this.capturedNode;
  }

  releaseCapturedNode(): void {
    this.capturedNode = null;
  }
}
