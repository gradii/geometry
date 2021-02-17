/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

// primary entry-point which is empty as of version 9. All components should
// be imported through their individual entry-points. This file is needed to
// satisfy the "ng_package" bazel rule which also requires a primary entry-point.

export const VERSION = '0.0.0-PLACEHOLDER';

// import { CanvasEngineOptions, SelectionBoxLayerFactory } from '@gradii/diagram/canvas-core';
// import { DefaultDiagramState, DiagramCore, LinkLayerFactory, NodeLayerFactory } from '@gradii/diagram/diagram-core';
// import {
//   DefaultLabelFactory,
//   DefaultLinkFactory,
//   DefaultNodeFactory,
//   DefaultPortFactory
// } from '@gradii/diagram/defaults';
// import { PathFindingLinkFactory } from '@gradii/diagram/dagre';
//
// /**
//  * Construct an engine with the defaults installed
//  */
// export const createEngine =  (options: CanvasEngineOptions = {}): DiagramCore => {
//   const engine = new DiagramCore(options);
//
//   // register model factories
//   engine.getLayerFactories().registerFactory(new NodeLayerFactory());
//   engine.getLayerFactories().registerFactory(new LinkLayerFactory());
//   engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());
//
//   engine.getLabelFactories().registerFactory(new DefaultLabelFactory());
//   engine.getNodeFactories().registerFactory(new DefaultNodeFactory()); // i cant figure out why
//   engine.getLinkFactories().registerFactory(new DefaultLinkFactory());
//   engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());
//   engine.getPortFactories().registerFactory(new DefaultPortFactory());
//
//   // register the default interaction behaviours
//   engine.getStateMachine().pushState(new DefaultDiagramState());
//   return engine;
// };
