/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AbstractReactFactory, GenerateWidgetEvent } from '../../core/abstract-react-factory';
import { SelectionLayerModel } from './selection-layer-model';
import { GenerateModelEvent } from '../../core/abstract-model-factory';
import { SelectionBoxWidget } from './selection-box-widget';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ENGINE } from '../../tokens';
import { CanvasEngine } from '../../canvas-engine';


@Component({
  selector: 'selection-box-layer-factory',
  template: `
    <ng-template let-event="event">
          <selection-box-widget></selection-box-widget>
    </ng-template>
  `
})
export class SelectionBoxLayerFactory extends AbstractReactFactory<SelectionLayerModel> implements OnInit {

  @ViewChild(TemplateRef)
  templateRef: TemplateRef<any>;

  constructor(@Inject(ENGINE) protected engine: CanvasEngine) {
    super('selection');
  }

  ngOnInit() {
    // register
    this.engine.getLayerFactories().registerFactory(this);
  }

  generateModel(event: GenerateModelEvent): SelectionLayerModel {
    return new SelectionLayerModel();
  }

  generateReactWidget(event: GenerateWidgetEvent<SelectionLayerModel>) {
    return this.templateRef;
    // return {
    //   component: SelectionBoxWidget,
    //   props: {
    //     rect: event.model.box
    //   }
    // };
  }
}
