/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title tag-checkable
 */
@Component({
  selector: 'tri-demo-tag-checkable',
  template: `
    <tri-demo-my-tag>Tag1</tri-demo-my-tag>
    <tri-demo-my-tag>Tag2</tri-demo-my-tag>
    <tri-demo-my-tag>Tag3</tri-demo-my-tag>
  `,
  styles: []
})
export class TriDemoTagCheckableComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
