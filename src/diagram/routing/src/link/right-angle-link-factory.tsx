import * as React from 'react';
import { RightAngleLinkWidget } from './right-angle-link-widget';
import { DefaultLinkFactory } from '@gradii/diagram/react-diagrams-defaults';
import { RightAngleLinkModel } from './right-angle-link-model';

/**
 * @author Daniel Lazar
 */
export class RightAngleLinkFactory extends DefaultLinkFactory<RightAngleLinkModel> {
  static NAME = 'rightAngle';

  constructor() {
    super(RightAngleLinkFactory.NAME);
  }

  generateModel(event): RightAngleLinkModel {
    return new RightAngleLinkModel();
  }

  generateReactWidget(event): JSX.Element {
    return <RightAngleLinkWidget diagramEngine={this.engine} link={event.model} factory={this}/>;
  }
}
