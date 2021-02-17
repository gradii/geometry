/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CanvasEngine } from '../../canvas-engine';
import { GenerateModelEvent } from '../../core/abstract-model-factory';
import { AbstractReactFactory, GenerateWidgetEvent } from '../../core/abstract-react-factory';
import { ENGINE } from '../../tokens';
import { SelectionLayerModel } from './selection-layer-model';


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
