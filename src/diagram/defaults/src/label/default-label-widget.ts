/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input } from '@angular/core';
import { DefaultLabelModel } from './default-label-model';


@Component({
  selector: 'default-label-widget',
  template: `
    <div class="label">
      {{ model.getOptions().label }}
    </div>
  `,
  styles: [
    `.label {
      background: rgba(0, 0, 0, 0.8);
      border-radius: 5px;
      color: white;
      font-size: 12px;
      padding: 4px 8px;
      font-family: sans-serif;
      user-select: none;
    }`
  ]
})
export class DefaultLabelWidget {
  @Input()
  model: DefaultLabelModel;
}
