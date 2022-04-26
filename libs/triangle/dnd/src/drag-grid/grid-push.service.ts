/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TriDropGridContainer } from '../directives/drop-grid-container';
import { DragRef } from '../drag-drop-ref/drag-ref';
import { DropGridContainerRef } from '../drag-drop-ref/drop-grid-container-ref';
import { TriDragGridItemComponent } from './drag-grid-item.component';

export const enum GridPushDirection {
  fromSouth = 'fromSouth',
  fromNorth = 'fromNorth',
  fromEast  = 'fromEast',
  fromWest  = 'fromWest',
}


export class GridPushService {
  public fromSouth: GridPushDirection;
  public fromNorth: GridPushDirection;
  public fromEast: GridPushDirection;
  public fromWest: GridPushDirection;

  private pushedItems: TriDragGridItemComponent[];
  private pushedItemsTemp: TriDragGridItemComponent[];
  private pushedItemsTempPath: { x: number; y: number }[][];
  private pushedItemsPath: { x: number; y: number }[][];
  /**
   * @deprecated
   * @private
   */
  private gridsterItem: TriDragGridItemComponent;
  // private gridster: TriDropGridContainer;
  private pushedItemsOrder: TriDragGridItemComponent[];
  private tryPattern: {
    fromEast: ((
      gridsterItemCollide: TriDragGridItemComponent,
      gridsterItem: TriDragGridItemComponent
    ) => boolean)[];
    fromWest: ((
      gridsterItemCollide: TriDragGridItemComponent,
      gridsterItem: TriDragGridItemComponent
    ) => boolean)[];
    fromNorth: ((
      gridsterItemCollide: TriDragGridItemComponent,
      gridsterItem: TriDragGridItemComponent
    ) => boolean)[];
    fromSouth: ((
      gridsterItemCollide: TriDragGridItemComponent,
      gridsterItem: TriDragGridItemComponent
    ) => boolean)[];
  };
  private iteration = 0;

  constructor(/*gridsterItem: TriDragGridItemComponent*/
              private dropGridContainerRef: DropGridContainerRef<any>) {
    this.pushedItems         = [];
    this.pushedItemsTemp     = [];
    this.pushedItemsTempPath = [];
    this.pushedItemsPath     = [];
    // this.gridsterItem        = gridsterItem;
    // this.gridster            = gridsterItem.gridster;
    this.tryPattern = {
      fromEast : [this.tryWest, this.trySouth, this.tryNorth, this.tryEast],
      fromWest : [this.tryEast, this.trySouth, this.tryNorth, this.tryWest],
      fromNorth: [this.trySouth, this.tryEast, this.tryWest, this.tryNorth],
      fromSouth: [this.tryNorth, this.tryEast, this.tryWest, this.trySouth]
    };
    this.fromSouth  = GridPushDirection.fromSouth;
    this.fromNorth  = GridPushDirection.fromNorth;
    this.fromEast   = GridPushDirection.fromEast;
    this.fromWest   = GridPushDirection.fromWest;
  }

  destroy(): void {
    // this.gridster = this.gridsterItem = null!;
  }

  pushItems(item: DragRef, direction: string, disable?: boolean): boolean {
    if (!disable) {
      this.pushedItemsOrder = [];
      this.iteration        = 0;
      const pushed          = this.push(item.data, direction);
      if (!pushed) {
        this.restoreTempItems();
      }
      this.pushedItemsOrder    = [];
      this.pushedItemsTemp     = [];
      this.pushedItemsTempPath = [];
      return pushed;
    } else {
      return false;
    }
  }

  restoreTempItems(): void {
    let i = this.pushedItemsTemp.length - 1;
    for (; i > -1; i--) {
      this.removeFromTempPushed(this.pushedItemsTemp[i]);
    }
  }

  //
  // restoreItems(): void {
  //   let i           = 0;
  //   const l: number = this.pushedItems.length;
  //   let pushedItem: TriDragGridItemComponent;
  //   for (; i < l; i++) {
  //     pushedItem         = this.pushedItems[i];
  //     pushedItem.renderX = pushedItem.x || 0;
  //     pushedItem.renderY = pushedItem.y || 0;
  //     // pushedItem.setSize();
  //   }
  //   this.pushedItems     = [];
  //   this.pushedItemsPath = [];
  // }
  //
  // setPushedItems(): void {
  //   let i           = 0;
  //   const l: number = this.pushedItems.length;
  //   let pushedItem: TriDragGridItemComponent;
  //   for (; i < l; i++) {
  //     pushedItem = this.pushedItems[i];
  //     pushedItem.checkItemChanges(pushedItem);
  //   }
  //   this.pushedItems     = [];
  //   this.pushedItemsPath = [];
  // }
  //
  // checkPushBack(): void {
  //   let i: number = this.pushedItems.length - 1;
  //   let change    = false;
  //   for (; i > -1; i--) {
  //     if (this.checkPushedItem(this.pushedItems[i], i)) {
  //       change = true;
  //     }
  //   }
  //   if (change) {
  //     this.checkPushBack();
  //   }
  // }

  private push(
    gridsterItem: TriDragGridItemComponent,
    direction: string
  ): boolean {
    if (this.iteration > 100) {
      console.warn('max iteration reached');
      return false;
    }
    if (this.dropGridContainerRef.data.checkGridCollision(gridsterItem)) {
      return false;
    }
    if (direction === '') {
      return false;
    }
    const conflicts: TriDragGridItemComponent[] =
            this.dropGridContainerRef.data.findItemsWithItem(gridsterItem);
    const invert                                = direction === this.fromNorth || direction === this.fromWest;
    // sort the list of conflicts in order of [y,x]. Invert when the push is from north and west
    // this is done so they don't conflict witch each other and revert positions, keeping the previous order
    conflicts.sort((a, b) => {
      if (invert) {
        return b.renderY - a.renderY || b.renderX - a.renderX;
      } else {
        return a.renderY - b.renderY || a.renderX - b.renderX;
      }
    });
    let i                                         = 0;
    let itemCollision: TriDragGridItemComponent;
    let makePush                                  = true;
    const pushedItems: TriDragGridItemComponent[] = [];
    for (; i < conflicts.length; i++) {
      itemCollision = conflicts[i];
      if (itemCollision === gridsterItem) {
        continue;
      }
      // if (!itemCollision.canBeDragged()) {
      //   makePush = false;
      //   break;
      // }
      const p = this.pushedItemsTemp.indexOf(itemCollision);
      if (p > -1 && this.pushedItemsTempPath[p].length > 10) {
        // stop if item is pushed more than 10 times to break infinite loops
        makePush = false;
        break;
      }

      const fnList = this.tryPattern[direction];

      for (const it of fnList) {
        if (it.call(this, itemCollision, gridsterItem)) {
          pushedItems.push(itemCollision);
          this.pushedItemsTemp.push(itemCollision);
          this.pushedItemsTempPath.push([itemCollision]);
          break;
        }
        makePush = false;
      }
      break;

    }
    if (!makePush) {
      i = this.pushedItemsOrder.lastIndexOf(pushedItems[0]);
      if (i > -1) {
        let j = this.pushedItemsOrder.length - 1;
        for (; j >= i; j--) {
          itemCollision = this.pushedItemsOrder[j];
          this.pushedItemsOrder.pop();
          this.removeFromTempPushed(itemCollision);
          this.removeFromPushedItem(itemCollision);
        }
      }
    }
    this.iteration++;
    return makePush;
  }

  private trySouth(
    gridsterItemCollide: TriDragGridItemComponent,
    gridsterItem: TriDragGridItemComponent
  ): boolean {
    if (!this.dropGridContainerRef.data.pushDirectionsSouth) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.renderY =
      gridsterItem.renderY + gridsterItem.renderRows;
    if (this.push(gridsterItemCollide, this.fromNorth)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  private tryNorth(
    gridsterItemCollide: TriDragGridItemComponent,
    gridsterItem: TriDragGridItemComponent
  ): boolean {
    if (!this.dropGridContainerRef.data.pushDirectionsNorth) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.renderY =
      gridsterItem.renderY - gridsterItemCollide.renderRows;
    if (this.push(gridsterItemCollide, this.fromSouth)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  private tryEast(
    gridsterItemCollide: TriDragGridItemComponent,
    gridsterItem: TriDragGridItemComponent
  ): boolean {
    if (!this.dropGridContainerRef.data.pushDirectionsEast) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.renderX =
      gridsterItem.renderX + gridsterItem.renderCols;
    if (this.push(gridsterItemCollide, this.fromWest)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  private tryWest(
    gridsterItemCollide: TriDragGridItemComponent,
    gridsterItem: TriDragGridItemComponent
  ): boolean {
    if (!this.dropGridContainerRef.data.pushDirectionsWest) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.renderX =
      gridsterItem.renderX - gridsterItemCollide.renderCols;
    if (this.push(gridsterItemCollide, this.fromEast)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }


  private addToTempPushed(gridsterItem: TriDragGridItemComponent): void {
    let i = this.pushedItemsTemp.indexOf(gridsterItem);
    if (i === -1) {
      i                           = this.pushedItemsTemp.push(gridsterItem) - 1;
      this.pushedItemsTempPath[i] = [];
    }
    this.pushedItemsTempPath[i].push({
      x: gridsterItem.renderX,
      y: gridsterItem.renderY
    });
  }

  private removeFromTempPushed(
    gridsterItem: TriDragGridItemComponent
  ): void {
    const i            = this.pushedItemsTemp.indexOf(gridsterItem);
    const tempPosition = this.pushedItemsTempPath[i].pop();
    if (!tempPosition) {
      return;
    }
    gridsterItem.renderX = tempPosition.x;
    gridsterItem.renderY = tempPosition.y;
    gridsterItem.setSize();
    if (!this.pushedItemsTempPath[i].length) {
      this.pushedItemsTemp.splice(i, 1);
      this.pushedItemsTempPath.splice(i, 1);
    }
  }

  private addToPushed(item: TriDragGridItemComponent): void {
    if (this.pushedItems.indexOf(item) < 0) {
      this.pushedItems.push(item);
      this.pushedItemsPath.push([
        {x: item.x || 0, y: item.y || 0},
        {x: item.renderX, y: item.renderY}
      ]);
    } else {
      const i = this.pushedItems.indexOf(item);
      this.pushedItemsPath[i].push({
        x: item.renderX,
        y: item.renderY
      });
    }
  }

  // private removeFromPushed(i: number): void {
  //   if (i > -1) {
  //     this.pushedItems.splice(i, 1);
  //     this.pushedItemsPath.splice(i, 1);
  //   }
  // }

  private removeFromPushedItem(
    gridsterItem: TriDragGridItemComponent
  ): void {
    const i = this.pushedItems.indexOf(gridsterItem);
    if (i > -1) {
      this.pushedItemsPath[i].pop();
      if (!this.pushedItemsPath.length) {
        this.pushedItems.splice(i, 1);
        this.pushedItemsPath.splice(i, 1);
      }
    }
  }

  // private checkPushedItem(
  //   pushedItem: TriDragGridItemComponent,
  //   i: number
  // ): boolean {
  //   const path = this.pushedItemsPath[i];
  //   let j      = path.length - 2;
  //   let lastPosition;
  //   let x;
  //   let y;
  //   let change = false;
  //   for (; j > -1; j--) {
  //     lastPosition       = path[j];
  //     x                  = pushedItem.renderX;
  //     y                  = pushedItem.renderY;
  //     pushedItem.renderX = lastPosition.x;
  //     pushedItem.renderY = lastPosition.y;
  //     if (!this.gridster.findItemWithItem(pushedItem)) {
  //       pushedItem.setSize();
  //       path.splice(j + 1, path.length - j - 1);
  //       change = true;
  //     } else {
  //       pushedItem.renderX = x;
  //       pushedItem.renderY = y;
  //     }
  //   }
  //   if (path.length < 2) {
  //     this.removeFromPushed(i);
  //   }
  //   return change;
  // }
}
