/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ElementRef, Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NodeDraggableEvent } from './draggable/draggable.events';
import { NodeDraggableService } from './draggable/node-draggable.service';
import { Tree } from './tree';
import { TreeController } from './tree-controller';
import {
  LoadNextLevelEvent,
  MenuItemSelectedEvent,
  NodeCheckedEvent,
  NodeCollapsedEvent,
  NodeCreatedEvent,
  NodeExpandedEvent,
  NodeIndeterminedEvent,
  NodeMovedEvent,
  NodeRemovedEvent,
  NodeRenamedEvent,
  NodeSelectedEvent,
  NodeUncheckedEvent,
  NodeUnselectedEvent
} from './tree.events';
import { RenamableNode } from './tree.types';
import { isEmpty } from './utils/fn.utils';

@Injectable()
export class TreeService {
  nodeMoved$: Subject<NodeMovedEvent> = new Subject<NodeMovedEvent>();
  nodeRemoved$: Subject<NodeRemovedEvent> = new Subject<NodeRemovedEvent>();
  nodeRenamed$: Subject<NodeRenamedEvent> = new Subject<NodeRenamedEvent>();
  nodeCreated$: Subject<NodeCreatedEvent> = new Subject<NodeCreatedEvent>();
  nodeSelected$: Subject<NodeSelectedEvent> = new Subject<NodeSelectedEvent>();
  nodeUnselected$: Subject<NodeUnselectedEvent> = new Subject<NodeUnselectedEvent>();
  nodeExpanded$: Subject<NodeExpandedEvent> = new Subject<NodeExpandedEvent>();
  nodeCollapsed$: Subject<NodeCollapsedEvent> = new Subject<NodeCollapsedEvent>();
  menuItemSelected$: Subject<MenuItemSelectedEvent> = new Subject<MenuItemSelectedEvent>();
  loadNextLevel$: Subject<LoadNextLevelEvent> = new Subject<LoadNextLevelEvent>();
  nodeChecked$: Subject<NodeCheckedEvent> = new Subject<NodeCheckedEvent>();
  nodeUnchecked$: Subject<NodeUncheckedEvent> = new Subject<NodeUncheckedEvent>();
  nodeIndetermined$: Subject<NodeIndeterminedEvent> = new Subject<NodeIndeterminedEvent>();

  private controllers: Map<string | number, TreeController> = new Map();

  constructor(@Inject(NodeDraggableService) private nodeDraggableService: NodeDraggableService) {
    this.nodeRemoved$.subscribe((e: NodeRemovedEvent) => e.node.removeItselfFromParent());
  }

  unselectStream(tree: Tree): Observable<NodeSelectedEvent> {
    return this.nodeSelected$.pipe(filter((e: NodeSelectedEvent) => tree !== e.node));
  }

  fireNodeRemoved(tree: Tree): void {
    this.nodeRemoved$.next(new NodeRemovedEvent(tree, tree.positionInParent));
  }

  fireNodeCreated(tree: Tree): void {
    this.nodeCreated$.next(new NodeCreatedEvent(tree));
  }

  fireNodeSelected(tree: Tree): void {
    this.nodeSelected$.next(new NodeSelectedEvent(tree));
  }

  fireNodeUnselected(tree: Tree): void {
    this.nodeUnselected$.next(new NodeUnselectedEvent(tree));
  }

  fireNodeRenamed(oldValue: RenamableNode | string, tree: Tree): void {
    this.nodeRenamed$.next(new NodeRenamedEvent(tree, oldValue, tree.value));
  }

  fireNodeMoved(tree: Tree, parent: Tree): void {
    this.nodeMoved$.next(new NodeMovedEvent(tree, parent));
  }

  fireMenuItemSelected(tree: Tree, selectedItem: string): void {
    this.menuItemSelected$.next(new MenuItemSelectedEvent(tree, selectedItem));
  }

  fireNodeSwitchFoldingType(tree: Tree): void {
    if (tree.isNodeExpanded()) {
      this.fireNodeExpanded(tree);
      if (this.shouldFireLoadNextLevel(tree)) {
        this.fireLoadNextLevel(tree);
      }
    } else if (tree.isNodeCollapsed()) {
      this.fireNodeCollapsed(tree);
    }
  }

  fireNodeChecked(tree: Tree): void {
    this.nodeChecked$.next(new NodeCheckedEvent(tree));
  }

  fireNodeUnchecked(tree: Tree): void {
    this.nodeUnchecked$.next(new NodeUncheckedEvent(tree));
  }

  draggedStream(tree: Tree, element: ElementRef): Observable<NodeDraggableEvent> {
    return this.nodeDraggableService.draggableNodeEvents$
      .pipe(
        filter((e: NodeDraggableEvent) => e.target === element),
        filter((e: NodeDraggableEvent) => !e.captured.tree.hasChild(tree))
      );
  }

  setController(id: string | number, controller: TreeController): void {
    this.controllers.set(id, controller);
  }

  deleteController(id: string | number): void {
    if (this.controllers.has(id)) {
      this.controllers.delete(id);
    }
  }

  getController(id: string | number): TreeController {
    if (this.controllers.has(id)) {
      return this.controllers.get(id);
    }

    return null;
  }

  hasController(id: string | number): boolean {
    return this.controllers.has(id);
  }

  fireNodeIndetermined(tree: Tree): void {
    this.nodeIndetermined$.next(new NodeIndeterminedEvent(tree));
  }

  private fireNodeExpanded(tree: Tree): void {
    this.nodeExpanded$.next(new NodeExpandedEvent(tree));
  }

  private fireNodeCollapsed(tree: Tree): void {
    this.nodeCollapsed$.next(new NodeCollapsedEvent(tree));
  }

  private fireLoadNextLevel(tree: Tree): void {
    this.loadNextLevel$.next(new LoadNextLevelEvent(tree));
  }

  private shouldFireLoadNextLevel(tree: Tree): boolean {
    const shouldLoadNextLevel =
            tree.node.emitLoadNextLevel &&
            !tree.node.loadChildren &&
            !tree.childrenAreBeingLoaded() &&
            isEmpty(tree.children);

    if (shouldLoadNextLevel) {
      tree.loadingChildrenRequested();
    }

    return shouldLoadNextLevel;
  }
}
