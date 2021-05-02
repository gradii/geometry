/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CanvasModel } from '../entities/canvas/canvas-model';
import {
  BaseEntity,
  BaseEntityEvent,
  BaseEntityGenerics,
  BaseEntityListener,
  BaseEntityOptions,
  DeserializeEvent
} from './base-entity';

export interface BaseModelListener extends BaseEntityListener {
  selectionChanged?: (event: BaseEntityEvent<BaseModel> & { isSelected: boolean }) => void;

  entityRemoved?: (event: BaseEntityEvent<BaseModel>) => void;
}

export interface BaseModelOptions extends BaseEntityOptions {
  type?: string;
  selected?: boolean;
  extras?: any;
}

export interface BaseModelGenerics extends BaseEntityGenerics {
  LISTENER: BaseModelListener;
  PARENT: BaseEntity;
  OPTIONS: BaseModelOptions;
}

export class BaseModel<G extends BaseModelGenerics = BaseModelGenerics> extends BaseEntity<G> {
  protected parent: G['PARENT'];

  // region
  type: string;
  selected: boolean;
  extras: any;
  // endreion

  constructor(options: G['OPTIONS']) {
    super(options);
  }

  performanceTune() {
    return true;
  }

  getParentCanvasModel(): CanvasModel {
    if (!this.parent) {
      return null;
    }
    if (this.parent instanceof CanvasModel) {
      return this.parent;
    } else if (this.parent instanceof BaseModel) {
      return this.parent.getParentCanvasModel();
    }
    return null;
  }

  getParent(): G['PARENT'] {
    return this.parent;
  }

  setParent(parent: G['PARENT']) {
    this.parent = parent;
  }

  getSelectionEntities(): Array<BaseModel> {
    return [this];
  }

  serialize() {
    return {
      ...super.serialize(),
      type    : this.type || this.options.type,
      selected: this.selected || this.options.selected,
      extras  : this.extras || this.options.extras
    };
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.options.extras   = event.data.extras;
    this.options.selected = event.data.selected;

    this.extras   = event.data.extras;
    this.selected = event.data.selected;
  }

  getType(): string {
    return this.type || this.options.type;
    // return this.options.type;
  }

  isSelected(): boolean {
    // return this.options.selected;
    return this.selected || this.options.selected;
  }

  isLocked(): boolean {
    const locked = super.isLocked();
    if (locked) {
      return true;
    }

    // delegate this call up to the parent
    if (this.parent) {
      return this.parent.isLocked();
    }
    return false;
  }

  setSelected(selected: boolean = true) {
    if (
      (this.selected || this.options.selected) !== selected
    ) {
      this.selected         = selected;
      this.options.selected = selected;

      this.fireEvent(
        {
          isSelected: selected
        },
        'selectionChanged'
      );
    }
  }

  remove() {
    this.fireEvent({}, 'entityRemoved');
  }
}
