/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractReactFactory, ENGINE, GenerateModelEvent, GenerateWidgetEvent } from '@gradii/diagram/canvas-core';
import { DiagramEngine } from '@gradii/diagram/diagram-core';
import { DefaultNodeModel } from './default-node-model';

@Component({
  selector: 'default-node-factory',
  template: `
    <ng-template #nodeFactory let-event="event">
      <default-node-widget [node]="event.model"></default-node-widget>
    </ng-template>
  `
})
export class DefaultNodeFactory extends AbstractReactFactory<DefaultNodeModel, DiagramEngine> implements OnInit {
  @ViewChild('nodeFactory', {read: TemplateRef, static: true})
  nodeFactoryTemplateRef: TemplateRef<any>;

  constructor(@Inject(ENGINE) protected engine: DiagramEngine) {
    super('default');
  }

  ngOnInit() {
    this.engine.getNodeFactories().registerFactory(this);
  }

  generateReactWidget(event: GenerateWidgetEvent<any>) {
    return this.nodeFactoryTemplateRef;
    // return {
    //   component: this.nodeFactoryTemplateRef,
    //   props: {
    //     engine: this.engine,
    //     node: event.model
    //   }
    // };
  }

  generateModel(event: GenerateModelEvent): DefaultNodeModel {
    return new DefaultNodeModel();
  }
}
