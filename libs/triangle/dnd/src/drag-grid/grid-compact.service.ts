/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { GridComponentInterface } from './grid.interface';
import {
  GridItem,
  GridItemComponentInterface
} from './grid-item.interface';
import { CompactType } from './grid-config.interface';

export class GridCompactService {
  constructor(private grid: GridComponentInterface) {
  }

  destroy(): void {
    this.grid = null!;
  }

  checkCompact(): void {
    if (this.grid.$options.compactType !== CompactType.None) {
      if (this.grid.$options.compactType === CompactType.CompactUp) {
        this.checkCompactMovement('y', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactLeft
      ) {
        this.checkCompactMovement('x', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactUpAndLeft
      ) {
        this.checkCompactMovement('y', -1);
        this.checkCompactMovement('x', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactLeftAndUp
      ) {
        this.checkCompactMovement('x', -1);
        this.checkCompactMovement('y', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactRight
      ) {
        this.checkCompactMovement('x', 1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactUpAndRight
      ) {
        this.checkCompactMovement('y', -1);
        this.checkCompactMovement('x', 1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactRightAndUp
      ) {
        this.checkCompactMovement('x', 1);
        this.checkCompactMovement('y', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactDown
      ) {
        this.checkCompactMovement('y', 1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactDownAndLeft
      ) {
        this.checkCompactMovement('y', 1);
        this.checkCompactMovement('x', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactDownAndRight
      ) {
        this.checkCompactMovement('y', 1);
        this.checkCompactMovement('x', 1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactLeftAndDown
      ) {
        this.checkCompactMovement('x', -1);
        this.checkCompactMovement('y', 1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactRightAndDown
      ) {
        this.checkCompactMovement('x', 1);
        this.checkCompactMovement('y', 1);
      }
    }
  }

  checkCompactItem(item: GridItem): void {
    if (this.grid.$options.compactType !== CompactType.None) {
      if (this.grid.$options.compactType === CompactType.CompactUp) {
        this.moveTillCollision(item, 'y', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactLeft
      ) {
        this.moveTillCollision(item, 'x', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactUpAndLeft
      ) {
        this.moveTillCollision(item, 'y', -1);
        this.moveTillCollision(item, 'x', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactLeftAndUp
      ) {
        this.moveTillCollision(item, 'x', -1);
        this.moveTillCollision(item, 'y', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactUpAndRight
      ) {
        this.moveTillCollision(item, 'y', -1);
        this.moveTillCollision(item, 'x', 1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactDown
      ) {
        this.moveTillCollision(item, 'y', 1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactDownAndLeft
      ) {
        this.moveTillCollision(item, 'y', 1);
        this.moveTillCollision(item, 'x', -1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactLeftAndDown
      ) {
        this.moveTillCollision(item, 'x', -1);
        this.moveTillCollision(item, 'y', 1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactDownAndRight
      ) {
        this.moveTillCollision(item, 'y', 1);
        this.moveTillCollision(item, 'x', 1);
      } else if (
        this.grid.$options.compactType === CompactType.CompactRightAndDown
      ) {
        this.moveTillCollision(item, 'x', 1);
        this.moveTillCollision(item, 'y', 1);
      }
    }
  }

  private checkCompactMovement(direction: 'x' | 'y', delta: number): void {
    let widgetMoved = false;
    this.grid.grid.forEach((widget: GridItemComponentInterface) => {
      if (widget.$item.compactEnabled !== false) {
        const moved = this.moveTillCollision(widget.$item, direction, delta);
        if (moved) {
          widgetMoved            = true;
          widget.item[direction] = widget.$item[direction];
          widget.itemChanged();
        }
      }
    });
    if (widgetMoved) {
      this.checkCompact();
    }
  }

  private moveTillCollision(
    item: GridItem,
    direction: 'x' | 'y',
    delta: number
  ): boolean {
    item[direction] += delta;
    if (this.grid.checkCollision(item)) {
      item[direction] -= delta;
      return false;
    } else {
      this.moveTillCollision(item, direction, delta);
      return true;
    }
  }
}
