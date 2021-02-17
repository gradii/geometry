/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractReactFactory, ENGINE, GenerateModelEvent, GenerateWidgetEvent } from '@gradii/diagram/canvas-core';
import { DiagramEngine } from '../../diagram-engine';
import { NodeLayerModel } from './node-layer-model';


@Component({
  selector: 'node-layer-factory',
  template: `
    <ng-template let-event="event">
      <node-layer-widget [layer]="event.model"></node-layer-widget>
    </ng-template>
  `
})
export class NodeLayerFactory extends AbstractReactFactory<NodeLayerModel, DiagramEngine> implements OnInit {

  @ViewChild(TemplateRef, {static: true})
  templateRef: TemplateRef<any>;

  constructor(@Inject(ENGINE) protected engine: DiagramEngine) {
    super('diagram-nodes');
  }

  ngOnInit() {
    // register
    this.engine.getLayerFactories().registerFactory(this);
  }

  generateModel(event: GenerateModelEvent): NodeLayerModel {
    return new NodeLayerModel();
  }

  generateReactWidget(event: GenerateWidgetEvent<NodeLayerModel>) {
    return this.templateRef;
    // return {
    //   component: NodeLayerWidget,
    //   props: {
    //     layer: event.model,
    //     engine: this.engine
    //   }
    // };
  }
}
