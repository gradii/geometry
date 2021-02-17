/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ElementRef } from '@angular/core';
import { Tree } from '../tree';

export class CapturedNode {
  constructor(private anElement: ElementRef, private aTree: Tree) {
  }

  get element(): ElementRef {
    return this.anElement;
  }

  get tree(): Tree {
    return this.aTree;
  }

  canBeDroppedAt(element: ElementRef): boolean {
    return !this.sameAs(element) && !this.contains(element);
  }

  contains(other: ElementRef): boolean {
    return this.element.nativeElement.contains(other.nativeElement);
  }

  sameAs(other: ElementRef): boolean {
    return this.element === other;
  }
}
