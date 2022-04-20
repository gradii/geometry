/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { GridComponentInterface } from './grid.interface';

export class GridUtilsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static merge(obj1: any, obj2: any, properties: any): any {
    for (const p in obj2) {
      if (obj2[p] !== void 0 && properties.hasOwnProperty(p)) {
        if (typeof obj2[p] === 'object') {
          obj1[p] = GridUtilsService.merge(obj1[p], obj2[p], properties[p]);
        } else {
          obj1[p] = obj2[p];
        }
      }
    }

    return obj1;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static checkTouchEvent(e: any): void {
    if (e.clientX === undefined && e.touches) {
      if (e.touches && e.touches.length) {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length) {
        e.clientX = e.changedTouches[0].clientX;
        e.clientY = e.changedTouches[0].clientY;
      }
    }
  }

  static checkContentClassForEvent(
    gridster: GridComponentInterface,
    e: MouseEvent
  ): boolean {
    if (gridster.$options.draggable.ignoreContent) {
      if (
        !GridUtilsService.checkDragHandleClass(
          e.target as HTMLElement,
          e.currentTarget as HTMLElement,
          gridster.$options.draggable.dragHandleClass,
          gridster.$options.draggable.ignoreContentClass
        )
      ) {
        return true;
      }
    } else {
      if (
        GridUtilsService.checkContentClass(
          e.target as HTMLElement,
          e.currentTarget as HTMLElement,
          gridster.$options.draggable.ignoreContentClass
        )
      ) {
        return true;
      }
    }
    return false;
  }

  static checkContentClassForEmptyCellClickEvent(
    gridster: GridComponentInterface,
    e: MouseEvent
  ): boolean {
    return (
      GridUtilsService.checkContentClass(
        e.target as HTMLElement,
        e.currentTarget as HTMLElement,
        gridster.$options.draggable.ignoreContentClass
      ) ||
      GridUtilsService.checkContentClass(
        e.target as HTMLElement,
        e.currentTarget as HTMLElement,
        gridster.$options.draggable.dragHandleClass
      )
    );
  }

  static checkDragHandleClass(
    target: HTMLElement,
    current: HTMLElement,
    dragHandleClass: string,
    ignoreContentClass
  ): boolean {
    if (!target || target === current) {
      return false;
    }
    if (target.hasAttribute('class')) {
      const classnames = target.getAttribute('class')!.split(' ');
      if (classnames.indexOf(dragHandleClass) > -1) {
        return true;
      }
      if (classnames.indexOf(ignoreContentClass) > -1) {
        return false;
      }
    }
    return GridUtilsService.checkDragHandleClass(
      target.parentNode as HTMLElement,
      current,
      dragHandleClass,
      ignoreContentClass
    );
  }

  static checkContentClass(
    target: HTMLElement,
    current: HTMLElement,
    contentClass: string
  ): boolean {
    if (!target || target === current) {
      return false;
    }
    if (
      target.hasAttribute('class') &&
      target.getAttribute('class')!.split(' ').indexOf(contentClass) > -1
    ) {
      return true;
    } else {
      return GridUtilsService.checkContentClass(
        target.parentNode as HTMLElement,
        current,
        contentClass
      );
    }
  }

  static compareItems(
    a: { x: number; y: number },
    b: { x: number; y: number }
  ): number {
    if (a.y > b.y) {
      return -1;
    } else if (a.y < b.y) {
      return 1;
    } else if (a.x > b.x) {
      return -1;
    } else {
      return 1;
    }
  }
}
