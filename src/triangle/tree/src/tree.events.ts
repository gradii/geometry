/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Tree } from './tree';
import { RenamableNode } from './tree.types';

export class NodeEvent {
  constructor(public node: Tree) {
  }
}

export class NodeSelectedEvent extends NodeEvent {
  constructor(node: Tree) {
    super(node);
  }
}

export class NodeUnselectedEvent extends NodeEvent {
  constructor(node: Tree) {
    super(node);
  }
}

export class NodeDestructiveEvent extends NodeEvent {
  constructor(node: Tree) {
    super(node);
  }
}

export class NodeMovedEvent extends NodeDestructiveEvent {
  constructor(node: Tree, public previousParent: Tree) {
    super(node);
  }
}

export class NodeRemovedEvent extends NodeDestructiveEvent {
  constructor(node: Tree, public lastIndex: number) {
    super(node);
  }
}

export class NodeCreatedEvent extends NodeDestructiveEvent {
  constructor(node: Tree) {
    super(node);
  }
}

export class NodeRenamedEvent extends NodeDestructiveEvent {
  constructor(node: Tree, public oldValue: string | RenamableNode, public newValue: string | RenamableNode) {
    super(node);
  }
}

export class NodeExpandedEvent extends NodeEvent {
  constructor(node: Tree) {
    super(node);
  }
}

export class NodeCollapsedEvent extends NodeEvent {
  constructor(node: Tree) {
    super(node);
  }
}

export class MenuItemSelectedEvent extends NodeEvent {
  constructor(node: Tree, public selectedItem: string) {
    super(node);
  }
}

export class LoadNextLevelEvent extends NodeEvent {
  constructor(node: Tree) {
    super(node);
  }
}

export class NodeCheckedEvent extends NodeEvent {
  constructor(node: Tree) {
    super(node);
  }
}

export class NodeUncheckedEvent extends NodeEvent {
  constructor(node: Tree) {
    super(node);
  }
}

export class NodeIndeterminedEvent extends NodeEvent {
  constructor(node: Tree) {
    super(node);
  }
}
