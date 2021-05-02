/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LabelWidget } from './diagram-core/entities/label/label-widget';
import { LinkLayerFactory } from './diagram-core/entities/link-layer/link-layer-factory';
import { LinkLayerWidget } from './diagram-core/entities/link-layer/link-layer-widget';
import { LinkWidget } from './diagram-core/entities/link/link-widget';
// import { NodeLayerFactory } from './diagram-core/entities/node-layer/node-layer-factory';
import { NodeLayerWidget } from './diagram-core/entities/node-layer/node-layer-widget';
import { NodeWidget } from './diagram-core/entities/node/node-widget';
import { PortWidget } from './diagram-core/entities/port/port-widget';
import { XLabelWidget } from './diagram-core/x/x-label-widget';
import { XLinkPointWidget } from './diagram-core/x/x-link-point-widget';
import { XLinkSegmentWidget } from './diagram-core/x/x-link-segment-widget';
import { XLinkWidget } from './diagram-core/x/x-link-widget';
import { XNodeWidget } from './diagram-core/x/x-node-widget';
import { XPortLabelWidget } from './diagram-core/x/x-port-label-widget';
import { CanvasWidget } from './canvas-core/entities/canvas/canvas-widget';
// import { SmartLayerWidget } from './canvas-core/entities/layer/smart-layer-widget';
import { TransformLayerWidget } from './canvas-core/entities/layer/transform-layer-widget';
import { SelectionBoxLayerFactory } from './canvas-core/entities/selection/selection-box-layer-factory';
import { SelectionBoxWidget } from './canvas-core/entities/selection/selection-box-widget';
import { ENGINE_OPTIONS } from './canvas-core/tokens';
// import { DefaultLabelFactory } from './defaults/label/default-label-factory';
// import { DefaultLabelWidget } from './defaults/label/default-label-widget';
// import { DefaultLinkFactory } from './defaults/link/default-link-factory';
// import { DefaultLinkPointWidget } from './defaults/link/default-link-point-widget';
// import { DefaultLinkSegmentWidget } from './defaults/link/default-link-segment-widget';
// import { DefaultLinkWidget } from './defaults/link/default-link-widget';
// import { DefaultNodeFactory } from './defaults/node/default-node-factory';
// import { DefaultNodeWidget } from './defaults/node/default-node-widget';
// import { DefaultPortFactory } from './defaults/port/default-port-factory';
// import { DefaultPortLabelWidget } from './defaults/port/default-port-label-widget';
import { PathDirective } from './diagram-core/path.directive';
import { DefaultDiagramState } from './diagram-core/states/default-diagram-state';
import { DiagramEngineComponent } from './diagram-engine.component';
import { DIAGRAM_STATES } from './tokens';

@NgModule({
  imports     : [
    CommonModule,
    // CanvasEngineModule,
    // DefaultsModule,
    // DiagramCoreModule,
  ],
  declarations: [
    DiagramEngineComponent,

    TransformLayerWidget,
    SelectionBoxLayerFactory,
    SelectionBoxWidget,

    CanvasWidget,
    // SmartLayerWidget,

    //
    // DefaultLabelFactory,
    // DefaultLabelWidget,
    //
    // DefaultLinkFactory,
    // DefaultLinkWidget,
    // DefaultLinkPointWidget,
    // DefaultLinkSegmentWidget,
    //
    // DefaultNodeFactory,
    // DefaultNodeWidget,
    //
    // DefaultPortFactory,
    // DefaultPortLabelWidget,


    NodeWidget,

    // NodeLayerFactory,
    NodeLayerWidget,

    LabelWidget,

    LinkWidget,

    LinkLayerFactory,
    LinkLayerWidget,

    PortWidget,

    XLabelWidget,
    XNodeWidget,
    XPortLabelWidget,
    XLinkWidget,
    XLinkPointWidget,
    XLinkSegmentWidget,

    PathDirective
  ],
  exports     : [
    DiagramEngineComponent,

    // DefaultLabelFactory,
    // DefaultLabelWidget,
    //
    // DefaultLinkFactory,
    // DefaultLinkWidget,
    // DefaultLinkPointWidget,
    // DefaultLinkSegmentWidget,
    //
    // DefaultNodeFactory,
    // DefaultNodeWidget,
    //
    // DefaultPortFactory,
    // DefaultPortLabelWidget,
  ],
  providers   : [
    {
      provide: DIAGRAM_STATES, useClass: DefaultDiagramState, multi: true,
    },
    {
      provide: ENGINE_OPTIONS, useValue: {},
    }
  ]
})
export class DiagramEngineModule {

}
