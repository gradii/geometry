import { DiagramCore } from '@gradii/diagram/diagram-core';
import { DefaultLinkSegmentWidget } from '@gradii/diagram/react-diagrams-defaults';
import * as _ from 'lodash';
import * as React from 'react';
import PathFinding from '../engine/path-finding';
import { PathFindingLinkFactory } from './path-finding-link-factory';
import { PathFindingLinkModel } from './path-finding-link-model';

export interface PathFindingLinkWidgetProps {
  color?: string;
  width?: number;
  smooth?: boolean;
  link: PathFindingLinkModel;
  diagramEngine: DiagramCore;
  factory: PathFindingLinkFactory;
}

export interface PathFindingLinkWidgetState {
  selected: boolean;
}

export class PathFindingLinkWidget extends React.Component<PathFindingLinkWidgetProps, PathFindingLinkWidgetState> {
  refPaths: React.RefObject<SVGPathElement>[];
  pathFinding: PathFinding;

  constructor(props: PathFindingLinkWidgetProps) {
    super(props);
    this.refPaths = [];
    this.state = {
      selected: false
    };
    this.pathFinding = new PathFinding(this.factory);
  }

  componentDidUpdate(): void {
    this.link.setRenderedPaths(
      this.refPaths.map((ref) => {
        return ref.current;
      })
    );
  }

  componentDidMount(): void {
    this.link.setRenderedPaths(
      this.refPaths.map((ref) => {
        return ref.current;
      })
    );
  }

  componentWillUnmount(): void {
    this.link.setRenderedPaths([]);
  }

  generateLink(path: string, id: string | number): JSX.Element {
    const ref = React.createRef<SVGPathElement>();
    this.refPaths.push(ref);
    return (
      <DefaultLinkSegmentWidget
        key={`link-${id}`}
        path={path}
        selected={this.state.selected}
        diagramEngine={this.diagramEngine}
        factory={this.diagramEngine.getFactoryForLink(this.link)}
        link={this.link}
        forwardRef={ref}
        onSelection={(selected) => {
          this.setState({selected: selected});
        }}
        extras={{}}
      />
    );
  }

  render() {
    this.refPaths = [];
    // ensure id is present for all points on the path
    let points = this.link.getPoints();
    let paths = [];

    // first step: calculate a direct path between the points being linked
    const directPathCoords = this.pathFinding.calculateDirectPath(_.first(points), _.last(points));

    const routingMatrix = this.factory.getRoutingMatrix();
    // now we need to extract, from the routing matrix, the very first walkable points
    // so they can be used as origin and destination of the link to be created
    const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);
    if (smartLink) {
      const {start, end, pathToStart, pathToEnd} = smartLink;

      // second step: calculate a path avoiding hitting other elements
      const simplifiedPath = this.pathFinding.calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd);

      paths.push(
        // smooth: boolean, extraProps: any, id: string | number, firstPoint: PointModel, lastPoint: PointModel
        this.generateLink(this.factory.generateDynamicPath(simplifiedPath), '0')
      );
    }
    return <>{paths}</>;
  }
}
