/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TriDropGridContainer } from '../directives/drop-grid-container';
import { TriDragGridItemComponent } from './drag-grid-item.component';

export class GridSwapService {
  private swapedItem: TriDragGridItemComponent | undefined;
  private gridsterItem: TriDragGridItemComponent;
  private grid: TriDropGridContainer;

  constructor(gridItem: TriDragGridItemComponent) {
    this.gridsterItem = gridItem;
    this.grid         = gridItem.dropContainer;
  }

  destroy(): void {
    this.grid = this.gridsterItem = this.swapedItem = null!;
  }

  swapItems(): void {
    if (this.grid.swap) {
      this.checkSwapBack();
      this.checkSwap(this.gridsterItem);
    }
  }

  checkSwapBack(): void {
    if (this.swapedItem) {
      const x: number         = this.swapedItem.renderX;
      const y: number         = this.swapedItem.renderY;
      this.swapedItem.renderX = this.swapedItem.x || 0;
      this.swapedItem.renderY = this.swapedItem.y || 0;
      if (this.grid.checkCollision(this.swapedItem)) {
        this.swapedItem.renderX = x;
        this.swapedItem.renderY = y;
      } else {
        // this.swapedItem.setSize();
        this.gridsterItem.renderX = this.gridsterItem.x || 0;
        this.gridsterItem.renderY = this.gridsterItem.y || 0;
        this.swapedItem           = undefined;
      }
    }
  }

  restoreSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.renderX = this.swapedItem.x || 0;
      this.swapedItem.renderY = this.swapedItem.y || 0;
      // this.swapedItem.setSize();
      this.swapedItem         = undefined;
    }
  }

  setSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.checkItemChanges(
        this.swapedItem
      );
      this.swapedItem = undefined;
    }
  }

  checkSwap(pushedBy: TriDragGridItemComponent): void {
    let gridsterItemCollision;
    if (this.grid.swapWhileDragging) {
      gridsterItemCollision = this.grid.checkCollisionForSwaping(
        pushedBy
      );
    } else {
      gridsterItemCollision = this.grid.checkCollision(pushedBy);
    }
    if (
      gridsterItemCollision &&
      gridsterItemCollision !== true &&
      gridsterItemCollision.canBeDragged()
    ) {
      const gridsterItemCollide: TriDragGridItemComponent =
              gridsterItemCollision;
      const copyCollisionX                                = gridsterItemCollide.renderX;
      const copyCollisionY                                = gridsterItemCollide.renderY;
      const copyX                                         = pushedBy.renderX;
      const copyY                                         = pushedBy.renderY;
      const diffX                                         = copyX - copyCollisionX;
      const diffY                                         = copyY - copyCollisionY;
      gridsterItemCollide.renderX                         = pushedBy.x - diffX;
      gridsterItemCollide.renderY                         = pushedBy.y - diffY;
      pushedBy.renderX                                    = gridsterItemCollide.x + diffX;
      pushedBy.renderY                                    = gridsterItemCollide.y + diffY;
      if (
        this.grid.checkCollision(gridsterItemCollide) ||
        this.grid.checkCollision(pushedBy)
      ) {
        pushedBy.renderX            = copyX;
        pushedBy.renderY            = copyY;
        gridsterItemCollide.renderX = copyCollisionX;
        gridsterItemCollide.renderY = copyCollisionY;
      } else {
        // gridsterItemCollide.setSize();
        this.swapedItem = gridsterItemCollide;
        if (this.grid.swapWhileDragging) {
          this.gridsterItem.checkItemChanges(
            this.gridsterItem
          );
          this.setSwapItem();
        }
      }
    }
  }
}
