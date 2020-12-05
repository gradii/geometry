/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractReactFactory, ENGINE, GenerateModelEvent, GenerateWidgetEvent } from '@gradii/diagram/canvas-core';
import { DiagramEngine } from '@gradii/diagram/diagram-core';
import { DefaultLinkModel } from './default-link-model';

@Component({
  selector: 'default-link-factory',
  template: `
    <ng-template #temp1 let-event="event">
      <svg:g default-link-widget [link]="event.model"></svg:g>
    </ng-template>

    <ng-template #temp2 let-event="event" let-ref="ref">
      <svg:path
        [ref]="ref"
        [ngStyle]="event.selected ? {
        strokeDasharray: '10, 2',
		    animation: 'animation-selected 1s linear infinite'
      }: null"
        [attr.stroke]="event?.stroke"
        [attr.stroke-width]="event?.model.getOptions().width"
        [attr.d]="event?.path"
      >
      </svg:path>
    </ng-template>
  `,
  styles: [
      `
      @keyframes animation-selected {
        from {
          stroke-dashoffset : 24;
        }
        to {
          stroke-dashoffset : 0;
        }
      }
    `
  ]
})
export class DefaultLinkFactory<Link extends DefaultLinkModel = DefaultLinkModel>
  extends AbstractReactFactory<Link, DiagramEngine> implements OnInit {

  @ViewChild('temp1', {read: TemplateRef, static: true})
  temp1Ref: TemplateRef<any>;

  @ViewChild('temp2', {read: TemplateRef, static: true})
  temp2Ref: TemplateRef<any>;


  temp1Event: GenerateWidgetEvent<any>;

  temp2Event: any;

  constructor(@Inject(ENGINE) protected engine: DiagramEngine) {
    super('default');
  }

  ngOnInit() {
    this.engine.getLinkFactories().registerFactory(this);
  }


  generateReactWidget(event: GenerateWidgetEvent<any>) {
    // return <DefaultLinkWidget link={event.model} diagramEngine={this.engine}/>;

    // return {
    //   component: DefaultLinkWidget,
    //   props: {
    //     link: event.model,
    //     diagramEngine: this.engine
    //   }
    // };

    // this.temp1Event = event;

    return this.temp1Ref;
  }

  generateModel(event: GenerateModelEvent): Link {
    return new DefaultLinkModel() as Link;
  }

  generateLinkSegment(model: Link, selected: boolean, path: string) {
    this.temp2Event = {
      model,
      selected,
      path,
      stroke: selected ? model.getOptions().selectedColor : model.getOptions().color,
      strokeWidth: model.getOptions().width,
    };

    return this.temp2Ref;

    // return (
    //   <S.Path
    //     selected={selected}
    //     stroke={selected ? model.getOptions().selectedColor : model.getOptions().color}
    //     strokeWidth={model.getOptions().width}
    //     d={path}
    //   />
    // );
  }
}
