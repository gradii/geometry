/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: 'path'
})
export class PathDirective implements OnInit {
  @Input()
  ref: (ref: SVGPathElement) => void;

  constructor(public elementRef: ElementRef) {
  }

  ngOnInit() {
    if (this.ref) {
      this.ref(this.elementRef.nativeElement);
    }
  }
}
