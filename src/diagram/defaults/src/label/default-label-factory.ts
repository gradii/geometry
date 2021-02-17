/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractReactFactory, ENGINE, GenerateModelEvent, GenerateWidgetEvent } from '@gradii/diagram/canvas-core';
import { DiagramEngine } from '@gradii/diagram/diagram-core';
import { DefaultLabelModel } from './default-label-model';


/**
 * remove default label factory
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
