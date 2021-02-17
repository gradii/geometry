/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NodeMenuAction, NodeMenuEvent } from './menu.events';

@Injectable()
export class NodeMenuService {
  nodeMenuEvents$: Subject<NodeMenuEvent> = new Subject<NodeMenuEvent>();

  fireMenuEvent(sender: HTMLElement, action: NodeMenuAction): void {
    const nodeMenuEvent: NodeMenuEvent = {sender, action};
    this.nodeMenuEvents$.next(nodeMenuEvent);
  }

  hideMenuStream(treeElementRef: ElementRef): Observable<any> {
    return this.nodeMenuEvents$.pipe(
      filter((e: NodeMenuEvent) => treeElementRef.nativeElement !== e.sender),
      filter((e: NodeMenuEvent) => e.action === NodeMenuAction.Close)
    );
  }

  hideMenuForAllNodesExcept(treeElementRef: ElementRef): void {
    this.nodeMenuEvents$.next({
      sender: treeElementRef.nativeElement,
      action: NodeMenuAction.Close
    });
  }
}
