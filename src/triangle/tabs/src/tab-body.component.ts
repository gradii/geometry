/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'tri-tab-body',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-template [ngTemplateOutlet]="content"></ng-template>
  `
})
export class TabBodyComponent {
  @Input() content: TemplateRef<any>;
}
