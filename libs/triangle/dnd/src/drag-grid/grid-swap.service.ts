/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { GridComponentInterface } from './grid.interface';
import { GridItemComponentInterface } from './grid-item.interface';

export class GridSwapService {
  private swapedItem: GridItemComponentInterface | undefined;
  private gridsterItem: GridItemComponentInterface;
  private grid: GridComponentInterface;

  constructor(gridItem: GridItemComponentInterface) {
    this.gridsterItem = gridItem;
    this.grid     = gridItem.gridster;
  }

  destroy(): void {
    this.grid = this.gridsterItem = this.swapedItem = null!;
  }

  swapItems(): void {
    if (this.grid.$options.swap) {
      this.checkSwapBack();
      this.checkSwap(this.gridsterItem);
    }
  }

  checkSwapBack(): void {
    if (this.swapedItem) {
      const x: number         = this.swapedItem.$item.x;
      const y: number         = this.swapedItem.$item.y;
      this.swapedItem.$item.x = this.swapedItem.item.x || 0;
      this.swapedItem.$item.y = this.swapedItem.item.y || 0;
      if (this.grid.checkCollision(this.swapedItem.$item)) {
        this.swapedItem.$item.x = x;
        this.swapedItem.$item.y = y;
      } else {
        this.swapedItem.setSize();
        this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
        this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
        this.swapedItem           = undefined;
      }
    }
  }

  restoreSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.$item.x = this.swapedItem.item.x || 0;
      this.swapedItem.$item.y = this.swapedItem.item.y || 0;
      this.swapedItem.setSize();
      this.swapedItem = undefined;
    }
  }

  setSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.checkItemChanges(
        this.swapedItem.$item,
        this.swapedItem.item
      );
      this.swapedItem = undefined;
    }
  }

  checkSwap(pushedBy: GridItemComponentInterface): void {
    let gridsterItemCollision;
    if (this.grid.$options.swapWhileDragging) {
      gridsterItemCollision = this.grid.checkCollisionForSwaping(
        pushedBy.$item
      );
    } else {
      gridsterItemCollision = this.grid.checkCollision(pushedBy.$item);
    }
    if (
      gridsterItemCollision &&
      gridsterItemCollision !== true &&
      gridsterItemCollision.canBeDragged()
    ) {
      const gridsterItemCollide: GridItemComponentInterface =
              gridsterItemCollision;
      const copyCollisionX                                  = gridsterItemCollide.$item.x;
      const copyCollisionY                                  = gridsterItemCollide.$item.y;
      const copyX                                           = pushedBy.$item.x;
      const copyY                                           = pushedBy.$item.y;
      const diffX                                           = copyX - copyCollisionX;
      const diffY                                           = copyY - copyCollisionY;
      gridsterItemCollide.$item.x                           = pushedBy.item.x - diffX;
      gridsterItemCollide.$item.y                           = pushedBy.item.y - diffY;
      pushedBy.$item.x                                      = gridsterItemCollide.item.x + diffX;
      pushedBy.$item.y                                      = gridsterItemCollide.item.y + diffY;
      if (
        this.grid.checkCollision(gridsterItemCollide.$item) ||
        this.grid.checkCollision(pushedBy.$item)
      ) {
        pushedBy.$item.x            = copyX;
        pushedBy.$item.y            = copyY;
        gridsterItemCollide.$item.x = copyCollisionX;
        gridsterItemCollide.$item.y = copyCollisionY;
      } else {
        gridsterItemCollide.setSize();
        this.swapedItem = gridsterItemCollide;
        if (this.grid.$options.swapWhileDragging) {
          this.gridsterItem.checkItemChanges(
            this.gridsterItem.$item,
            this.gridsterItem.item
          );
          this.setSwapItem();
        }
      }
    }
  }
}
