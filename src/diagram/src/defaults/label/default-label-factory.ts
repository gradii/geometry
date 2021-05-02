/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GenerateModelEvent } from '../../canvas-core/core/abstract-model-factory';
import { AbstractReactFactory, GenerateWidgetEvent } from '../../canvas-core/core/abstract-react-factory';
import { ENGINE } from '../../canvas-core/tokens';
import { DiagramEngine } from '../../diagram-core/diagram-engine';
import { DefaultLabelModel } from './default-label-model';


/**
 * remove default label factory
 * @deprecated
 */
@Component({
  selector: 'default-label-factory',
  template: `
    <ng-template #labelWidget let-event="event">
      <default-label-widget [model]="event.model"></default-label-widget>
    </ng-template>
  `
})
export class DefaultLabelFactory extends AbstractReactFactory<DefaultLabelModel, DiagramEngine> implements OnInit {
  @ViewChild('labelWidget', {read: TemplateRef, static: true})
  labelTemplateRef: TemplateRef<any>;

  constructor(@Inject(ENGINE) protected engine: DiagramEngine) {
    super('default');
  }

  ngOnInit() {
    this.engine.getLabelFactories().registerFactory(this);
  }

  generateReactWidget(event: GenerateWidgetEvent<DefaultLabelModel>) {
    return this.labelTemplateRef;
    // return {
    //   // component: DefaultLabelWidget,
    //   component: this.labelTemplateRef,
    //   props: {
    //     model: event.model
    //   }
    // };
  }

  generateModel(event: GenerateModelEvent): DefaultLabelModel {
    return new DefaultLabelModel();
  }
}
