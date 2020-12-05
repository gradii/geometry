/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AbstractReactFactory, ENGINE,
  GenerateModelEvent,
  GenerateWidgetEvent
} from '@gradii/diagram/canvas-core';
import { DiagramEngine } from '../../diagram-engine';
import { LinkLayerModel } from './link-layer-model';


@Component({
  selector: 'link-layer-factory',
  template: `
    <ng-template let-layer="layer" let-event="event">
        <svg:g link-layer-widget [layer]="event.model"></svg:g>
    </ng-template>
  `
})
export class LinkLayerFactory extends AbstractReactFactory<LinkLayerModel, DiagramEngine> implements OnInit {

  @ViewChild(TemplateRef, {static: true})
  templateRef: TemplateRef<any>;

  constructor(@Inject(ENGINE) public engine: DiagramEngine) {
    super('diagram-links');
  }

  ngOnInit() {
    // register
    this.engine.getLayerFactories().registerFactory(this);
  }

  generateModel(event: GenerateModelEvent): LinkLayerModel {
    return new LinkLayerModel();
  }

  generateReactWidget(event: GenerateWidgetEvent<LinkLayerModel>) {
    return this.templateRef;
    // return {
    //   component: this.templateRef,
    //   props    : {
    //     layer : event.model,
    //     engine: this.engine
    //   }
    // };
  }
}
