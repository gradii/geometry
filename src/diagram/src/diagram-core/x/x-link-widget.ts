/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewChecked, AfterViewInit, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { DefaultLinkModel } from '../../models/default-link-model';
import { ENGINE } from '../../canvas-core/tokens';
// import { DefaultLinkPointWidget } from '../../defaults/link/default-link-point-widget';
// import { DefaultLinkSegmentWidget } from '../../defaults/link/default-link-segment-widget';
import { DiagramEngine } from '../diagram-engine';
import { LinkWidget } from '../entities/link/link-widget';
import { PointModel } from '../entities/link/point-model';
import { XLinkPointWidget } from './x-link-point-widget';
import { XLinkSegmentWidget } from './x-link-segment-widget';

export interface DefaultLinkProps {
  link: DefaultLinkModel;
  diagramEngine: DiagramEngine;
  pointAdded?: (point: PointModel, event: MouseEvent) => any;
}

export interface DefaultLinkState {
  selected: boolean;
}

@Component({
  selector: 'g[x-link-widget]',
  template: `
    <!-- todo {{ paths }}-->

    <ng-template ngFor let-it [ngForOf]="svgPaths">
      <svg:g x-link-segment-widget
             [ref]="it.ref"
             [path]="link.getSVGPath()"
             [selected]="selected"
             [link]="link"
             (selection)="selected = $event"
             (mousedown)="addPointToLink($event, 1);"
      >
      </svg:g>
    </ng-template>

    <ng-template ngFor let-it [ngForOf]="pointPaths">
      <svg:g x-link-point-widget
             [point]="it.point"
             [colorSelected]="it.colorSelected"
             [color]="it.color"
      >
      </svg:g>
    </ng-template>

    <ng-template ngFor let-it [ngForOf]="linkPaths">
      <svg:g x-link-segment-widget
             [ref]="it.ref"
             [path]="link.getSVGPath()"
             [selected]="selected"
             [factory]="engine.getFactoryForLink(this.link)"
             [link]="link"
             (selection)="selected = $event"
             (mousedown)="addPointToLink($event, it.j + 1);"
      >
      </svg:g>
    </ng-template>
  `,
  host: {
    '[attr.data-default-link-test]': 'link.testName'
  }
})
export class XLinkWidget implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  public refPaths: SVGPathElement[] = [];

  @Input() link: DefaultLinkModel;
  // @Input() diagramEngine: DiagramEngine;
  @Input() pointAdded?: (point: PointModel, event: MouseEvent) => any;

  @Input() selected: boolean = false;

  svgPaths: any[] = [];
  pointPaths: any[] = [];
  linkPaths: any[] = [];

  constructor(@Inject(ENGINE) public engine: DiagramEngine) {
  }

  ngAfterViewChecked(): void {
    this.link.setRenderedPaths(
      this.refPaths.map((ref) => {
        return ref;
      })
    );
  }

  ngOnInit(): void {
    this.link.setRenderedPaths(
      this.refPaths.map((ref) => {
        return ref;
      })
    );
  }

  ngOnDestroy(): void {
    this.link.setRenderedPaths([]);
  }

  addPointToLink(event: MouseEvent, index: number) {
    if (
      !event.shiftKey &&
      !this.link.isLocked() &&
      this.link.getPoints().length - 1 <= this.engine.getMaxNumberPointsPerLink()
    ) {
      const point = new PointModel({
        link: this.link,
        position: this.engine.getRelativeMousePoint(event)
      });
      this.link.addPoint(point, index);
      // event.persist();
      // event.stopPropagation();
      // this.forceUpdate(() => {
      //   this.diagramEngine.getActionEventBus().fireAction({
      //     event,
      //     model: point
      //   });
      // });
    }
  }

  generatePoint(point: PointModel) {
    return {
      component: XLinkPointWidget,
      props: {
        key: point.getID(),
        point: point as any,
        colorSelected: this.link.selectedColor,
        color: this.link.color,
      }
    };
  }

  generateLink(path: string, extraProps: any, id: string | number) {
    // const ref = React.createRef<SVGPathElement>();
    // this.refPaths.push(ref);

    return {
      component: XLinkSegmentWidget,
      props: {
        key: `link-${id}`,
        path: path,
        selected: this.selected,
        diagramEngine: this.engine,
        // factory: this.engine.getFactoryForLink(this.link),
        link: this.link,
        // forwardRef: ref,
        onSelection: (selected: boolean) => {
          this.selected = selected;
        },
        extras: extraProps
      }
    };
    // return (
    //   <DefaultLinkSegmentWidget
    //     key={`link-${id}`}
    //     path={path}
    //     selected={this.state.selected}
    //     diagramEngine={this.diagramEngine}
    //     factory={this.diagramEngine.getFactoryForLink(this.link)}
    //     link={this.link}
    //     forwardRef={ref}
    //     onSelection={(selected) => {
    //       this.setState({selected: selected});
    //     }}
    //     extras={extraProps}
    //   />
    // );
  }

  ngAfterViewInit() {
    // ensure id is present for all points on the path
    let points = this.link.getPoints();
    let paths = [];
    this.refPaths = [];

    if (points.length === 2) {
      // paths.push(
      //
      // );

      this.svgPaths.push(
        {
          ref: (ref: SVGPathElement) => {
            this.refPaths.push(ref);
          },
          path: this.link.getSVGPath(),
        }
        // this.generateLink(
        //   this.link.getSVGPath(),
        //   {
        //     onMouseDown: (event: any) => {
        //       this.addPointToLink(event, 1);
        //     }
        //   },
        //   '0'
        // )
      );


      // draw the link as dangeling
      if (this.link.getTargetPort() == null) {
        // paths.push(this.generatePoint(points[1]));
        this.pointPaths.push({
          point: points[1] as any,
          colorSelected: this.link.selectedColor,
          color: this.link.color,
        });
      }
    } else {
      // draw the multiple anchors and complex line instead
      for (let j = 0; j < points.length - 1; j++) {
        paths.push(
          this.generateLink(
            LinkWidget.generateLinePath(points[j], points[j + 1]),
            {
              'data-linkid': this.link.getID(),
              'data-point': j,
              onMouseDown: (event: MouseEvent) => {
                this.addPointToLink(event, j + 1);
              }
            },
            j
          )
        );

        this.linkPaths.push(
          {
            ref: (ref: SVGPathElement) => {
              this.refPaths.push(ref);
            },
            path: LinkWidget.generateLinePath(points[j], points[j + 1]),
            point: j
          }
        );
      }

      // render the circles
      for (let i = 1; i < points.length - 1; i++) {
        paths.push(this.generatePoint(points[i]));
      }

      if (this.link.getTargetPort() == null) {
        paths.push(this.generatePoint(points[points.length - 1]));
      }
    }

    // return <g data-default-link-test={this.link.getOptions().testName}>{paths}</g>;
  }
}
