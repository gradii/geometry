/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GenerateModelEvent } from '../../canvas-core/core/abstract-model-factory';
import {
  AbstractReactFactory,
  GenerateWidgetEvent
} from '../../canvas-core/core/abstract-react-factory';
import { ENGINE } from '../../canvas-core/tokens';
import { DiagramEngine } from '../../diagram-core/diagram-engine';
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
