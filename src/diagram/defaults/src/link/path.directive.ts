/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: 'path'
})
export class PathDirective implements OnInit {
  constructor(public elementRef: ElementRef) {
  }

  @Input()
  ref: (ref: SVGPathElement) => void;

  ngOnInit() {
    if (this.ref) {
      this.ref(this.elementRef.nativeElement);
    }
  }
}
