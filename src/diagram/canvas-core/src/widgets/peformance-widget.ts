/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { BaseModel } from '../core-models/base-model';
import { ChangeDetectionStrategy, Component, Input, OnChanges, ɵmarkDirty } from '@angular/core';

@Component({
  selector: 'peformance-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `
})
export class PeformanceWidget implements OnChanges {

  @Input()
  serialized: object;

  @Input()
  model: BaseModel;

  ngOnChanges() {
    ɵmarkDirty(this);
  }

  // shouldComponentUpdate(
  //   nextProps: Readonly<PeformanceWidgetProps>,
  //   nextState: Readonly<PeformanceWidgetState>,
  //   nextContext: any
  // ): boolean {
  //   if (!this.model.performanceTune()) {
  //     return true;
  //   }
  //   // deserialization event
  //   if (this.model !== nextProps.model) {
  //     return true;
  //   }
  //
  //   // change event
  //   return !_.isEqual(this.serialized, nextProps.serialized);
  // }

  // render() {
  //   return this.children();
  // }
}
