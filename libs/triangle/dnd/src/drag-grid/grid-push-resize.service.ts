/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TriDropGridContainer } from '../directives/drop-grid-container';
import { TriDragGridItemComponent } from './drag-grid-item.component';
import { GridItem } from './grid-item.interface';

export class GridPushResizeService {
  public fromSouth: string;
  public fromNorth: string;
  public fromEast: string;
  public fromWest: string;
  private pushedItems: Array<TriDragGridItemComponent>;
  private pushedItemsPath: Array<Array<GridItem>>;
  private gridItem: TriDragGridItemComponent;
  private grid: TriDropGridContainer;
  private tryPattern: {
    fromEast: (
      gridsterItemCollide: TriDragGridItemComponent,
      gridsterItem: TriDragGridItemComponent,
      direction: string
    ) => boolean;
    fromWest: (
      gridsterItemCollide: TriDragGridItemComponent,
      gridsterItem: TriDragGridItemComponent,
      direction: string
    ) => boolean;
    fromNorth: (
      gridsterItemCollide: TriDragGridItemComponent,
      gridsterItem: TriDragGridItemComponent,
      direction: string
    ) => boolean;
    fromSouth: (
      gridsterItemCollide: TriDragGridItemComponent,
      gridsterItem: TriDragGridItemComponent,
      direction: string
    ) => boolean;
  };

  constructor(gridsterItem: TriDragGridItemComponent) {
    this.pushedItems     = [];
    this.pushedItemsPath = [];
    this.gridItem        = gridsterItem;
    this.grid            = gridsterItem.gridContainer;
    this.tryPattern      = {
      fromEast : this.tryWest,
      fromWest : this.tryEast,
      fromNorth: this.trySouth,
      fromSouth: this.tryNorth
    };
    this.fromSouth       = 'fromSouth';
    this.fromNorth       = 'fromNorth';
    this.fromEast        = 'fromEast';
    this.fromWest        = 'fromWest';
  }

  destroy(): void {
    this.grid = this.gridItem = null!;
  }

  pushItems(direction: string): boolean {
    if (this.grid.pushResizeItems) {
      return this.push(this.gridItem, direction);
    } else {
      return false;
    }
  }

  restoreItems(): void {
    let i           = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: TriDragGridItemComponent;
    for (; i < l; i++) {
      pushedItem            = this.pushedItems[i];
      pushedItem.renderX    = pushedItem.x || 0;
      pushedItem.renderY    = pushedItem.y || 0;
      pushedItem.renderCols = pushedItem.cols || 1;
      pushedItem.renderRows = pushedItem.rows || 1;
      pushedItem.setSize();
    }
    this.pushedItems     = [];
    this.pushedItemsPath = [];
  }

  setPushedItems(): void {
    let i           = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: TriDragGridItemComponent;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.checkItemChanges(pushedItem);
    }
    this.pushedItems     = [];
    this.pushedItemsPath = [];
  }

  checkPushBack(): void {
    let i: number = this.pushedItems.length - 1;
    let change    = false;
    for (; i > -1; i--) {
      if (this.checkPushedItem(this.pushedItems[i], i)) {
        change = true;
      }
    }
    if (change) {
      this.checkPushBack();
    }
  }

  private push(
    gridsterItem: TriDragGridItemComponent,
    direction: string
  ): boolean {
    const gridsterItemCollision: TriDragGridItemComponent | boolean =
            this.grid.checkCollision(gridsterItem);
    if (
      gridsterItemCollision &&
      gridsterItemCollision !== true &&
      gridsterItemCollision !== this.gridItem /*&&
      gridsterItemCollision.canBeResized()*/
    ) {
      if (
        this.tryPattern[direction].call(
          this,
          gridsterItemCollision,
          gridsterItem,
          direction
        )
      ) {
        return true;
      }
    } else if (gridsterItemCollision === false) {
      return true;
    }
    return false;
  }

  private trySouth(
    gridsterItemCollide: TriDragGridItemComponent,
    gridsterItem: TriDragGridItemComponent,
    direction: string
  ): boolean {
    const backUpY                  = gridsterItemCollide.renderY;
    const backUpRows               = gridsterItemCollide.renderRows;
    gridsterItemCollide.renderY    =
      gridsterItem.renderY + gridsterItem.renderRows;
    gridsterItemCollide.renderRows =
      backUpRows + backUpY - gridsterItemCollide.renderY;
    if (
      !this.grid.checkCollisionTwoItems(
        gridsterItemCollide,
        gridsterItem
      ) &&
      !this.grid.checkGridCollision(gridsterItemCollide)
    ) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.renderY    = backUpY;
      gridsterItemCollide.renderRows = backUpRows;
    }
    return false;
  }

  private tryNorth(
    gridsterItemCollide: TriDragGridItemComponent,
    gridsterItem: TriDragGridItemComponent,
    direction: string
  ): boolean {
    const backUpRows               = gridsterItemCollide.renderRows;
    gridsterItemCollide.renderRows =
      gridsterItem.renderY - gridsterItemCollide.renderY;
    if (
      !this.grid.checkCollisionTwoItems(
        gridsterItemCollide,
        gridsterItem
      ) &&
      !this.grid.checkGridCollision(gridsterItemCollide)
    ) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.renderRows = backUpRows;
    }
    return false;
  }

  private tryEast(
    gridsterItemCollide: TriDragGridItemComponent,
    gridsterItem: TriDragGridItemComponent,
    direction: string
  ): boolean {
    const backUpX                  = gridsterItemCollide.renderX;
    const backUpCols               = gridsterItemCollide.renderCols;
    gridsterItemCollide.renderX    =
      gridsterItem.renderX + gridsterItem.renderCols;
    gridsterItemCollide.renderCols =
      backUpCols + backUpX - gridsterItemCollide.renderX;
    if (
      !this.grid.checkCollisionTwoItems(
        gridsterItemCollide,
        gridsterItem
      ) &&
      !this.grid.checkGridCollision(gridsterItemCollide)
    ) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.renderX    = backUpX;
      gridsterItemCollide.renderCols = backUpCols;
    }
    return false;
  }

  private tryWest(
    gridsterItemCollide: TriDragGridItemComponent,
    gridsterItem: TriDragGridItemComponent,
    direction: string
  ): boolean {
    const backUpCols               = gridsterItemCollide.renderCols;
    gridsterItemCollide.renderCols =
      gridsterItem.renderX - gridsterItemCollide.renderX;
    if (
      !this.grid.checkCollisionTwoItems(
        gridsterItemCollide,
        gridsterItem
      ) &&
      !this.grid.checkGridCollision(gridsterItemCollide)
    ) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.renderCols = backUpCols;
    }
    return false;
  }

  private addToPushed(gridsterItem: TriDragGridItemComponent): void {
    if (this.pushedItems.indexOf(gridsterItem) < 0) {
      this.pushedItems.push(gridsterItem);
      this.pushedItemsPath.push([
        {
          x   : gridsterItem.x || 0,
          y   : gridsterItem.y || 0,
          cols: gridsterItem.cols || 0,
          rows: gridsterItem.rows || 0
        },
        {
          x   : gridsterItem.renderX,
          y   : gridsterItem.renderY,
          cols: gridsterItem.renderCols,
          rows: gridsterItem.renderRows
        }
      ]);
    } else {
      const i = this.pushedItems.indexOf(gridsterItem);
      this.pushedItemsPath[i].push({
        x   : gridsterItem.renderX,
        y   : gridsterItem.renderY,
        cols: gridsterItem.renderCols,
        rows: gridsterItem.renderRows
      });
    }
  }

  private removeFromPushed(i: number): void {
    if (i > -1) {
      this.pushedItems.splice(i, 1);
      this.pushedItemsPath.splice(i, 1);
    }
  }

  private checkPushedItem(
    pushedItem: TriDragGridItemComponent,
    i: number
  ): boolean {
    const path = this.pushedItemsPath[i];
    let j      = path.length - 2;
    let lastPosition: { x: number; y: number; cols: number; rows: number };
    let x;
    let y;
    let cols;
    let rows;
    for (; j > -1; j--) {
      lastPosition          = path[j];
      x                     = pushedItem.renderX;
      y                     = pushedItem.renderY;
      cols                  = pushedItem.renderCols;
      rows                  = pushedItem.renderRows;
      pushedItem.renderX    = lastPosition.x;
      pushedItem.renderY    = lastPosition.y;
      pushedItem.renderCols = lastPosition.cols;
      pushedItem.renderRows = lastPosition.rows;
      if (!this.grid.findItemWithItem(pushedItem)) {
        pushedItem.setSize();
        path.splice(j + 1, path.length - 1 - j);
      } else {
        pushedItem.renderX    = x;
        pushedItem.renderY    = y;
        pushedItem.renderCols = cols;
        pushedItem.renderRows = rows;
      }
    }
    if (path.length < 2) {
      this.removeFromPushed(i);
      return true;
    }
    return false;
  }
}
