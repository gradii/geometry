/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewChecked, AfterViewInit, Component, Inject, Input, OnDestroy, OnInit
} from '@angular/core';
import { ENGINE } from '../../canvas-core/tokens';
import { DiagramLinkModel } from '../../models/diagram-link-model';
// import { DefaultLinkPointWidget } from '../../defaults/link/default-link-point-widget';
// import { DefaultLinkSegmentWidget } from '../../defaults/link/default-link-segment-widget';
import { DiagramEngine } from '../diagram-engine';
import { LinkModel } from '../entities/link/link-model';
import { PointModel } from '../entities/link/point-model';
import { XLinkPointWidget } from './x-link-point-widget';
import { XLinkSegmentWidget } from './x-link-segment-widget';

export interface DefaultLinkProps {
  link: DiagramLinkModel;
  diagramEngine: DiagramEngine;
  pointAdded?: (point: PointModel, event: MouseEvent) => any;
}

export interface DefaultLinkState {
  selected: boolean;
}

@Component({
  selector: 'g[x-link-widget]',
  template: `
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
             [link]="link"
             (selection)="selected = $event"
             (mousedown)="addPointToLink($event, it.j + 1);"
      >
      </svg:g>
    </ng-template>
  `,
  host    : {
    '[attr.data-default-link-test]': 'link.labelName'
  }
})
export class XLinkWidget implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  refPaths: SVGPathElement[] = [];

  @Input() link: DiagramLinkModel;
  // @Input() diagramEngine: DiagramEngine;
  @Input() pointAdded?: (point: PointModel, event: MouseEvent) => any;

  @Input() selected: boolean = false;

  svgPaths: any[]   = [];
  pointPaths: any[] = [];
  linkPaths: any[]  = [];

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
    return; // not support

    if (
      (event.ctrlKey || event.metaKey) &&
      !this.link.isLocked() &&
      this.link.getPoints().length - 1 <= this.engine.getMaxNumberPointsPerLink()
    ) {
      const point = new PointModel({
        link    : this.link,
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
      props    : {
        key          : point.getID(),
        point        : point as any,
        colorSelected: this.link.selectedColor,
        color        : this.link.color,
      }
    };
  }

  generateLink(path: string, extraProps: any, id: string | number) {
    // const ref = React.createRef<SVGPathElement>();
    // this.refPaths.push(ref);

    return {
      component: XLinkSegmentWidget,
      props    : {
        key          : `link-${id}`,
        path         : path,
        selected     : this.selected,
        diagramEngine: this.engine,
        // factory: this.engine.getFactoryForLink(this.link),
        link: this.link,
        // forwardRef: ref,
        onSelection: (selected: boolean) => {
          this.selected = selected;
        },
        extras     : extraProps
      }
    };
  }

  ngAfterViewInit() {
    // ensure id is present for all points on the path
    const points  = this.link.getPoints();
    const paths   = [];
    this.refPaths = [];

    this.svgPaths.push(
      {
        ref : (ref: SVGPathElement) => {
          this.refPaths.push(ref);
        },
        path: this.link.getSVGPath(),
      }
    );

    for (const it of points) {
      this.pointPaths.push({
        point        : it as any,
        colorSelected: this.link.selectedColor,
        color        : this.link.color,
      });
    }
  }

  static ngAcceptInputType_link: LinkModel;
}
