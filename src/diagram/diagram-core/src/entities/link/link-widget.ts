/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  BaseEntityEvent,
  BasePositionModel,
  ENGINE,
  ListenerHandle
} from '@gradii/diagram/canvas-core';
import { DiagramEngine } from '../../diagram-engine';
import { PortModel } from '../port/port-model';
import { LinkModel } from './link-model';
import { PointModel } from './point-model';

// export interface LinkProps {
//   link: LinkModel;
//   diagramEngine: DiagramEngine;
// }

// export interface LinkState {
//   sourcePort: PortModel;
//   targetPort: PortModel;
// }

@Component({
  selector: 'link-widget, g[link-widget]',
  template: `
    <!--    <peformance-widget model={this.link} serialized={this.link.serialize()}>-->
    <!--      {() => {-->
    <!--      return (-->
    <!--    <svg:g [attr.data-link-id]="link.getID()">-->
    <ng-template [ngTemplateOutlet]="engine.generateWidgetForLink(link)"
                 [ngTemplateOutletContext]="{event: {model: link}}">
    </ng-template>
    <ng-template let-labelModel let-index="index" ngFor [ngForOf]="link.getLabels()">
      <svg:g label-widget
             [attr.key]="labelModel.getID()"
             [label]="labelModel"
             [index]="index"
      ></svg:g>
    </ng-template>
    <!--    </svg:g>-->
    <!--      );-->
    <!--      }}-->
    <!--    </peformance_widget>-->
  `
})
export class LinkWidget implements OnChanges, OnInit, OnDestroy {

  @Input() link: LinkModel;

  @Input() sourcePort: PortModel;
  @Input() targetPort: PortModel;

  sourceListener: ListenerHandle;
  targetListener: ListenerHandle;

  // static getDerivedStateFromProps(nextProps: LinkProps, prevState: LinkState): LinkState {
  //   return {
  //     sourcePort: nextProps.link.getSourcePort(),
  //     targetPort: nextProps.link.getTargetPort()
  //   };
  // }

  constructor(@Inject(ENGINE) public engine: DiagramEngine,
              public changeDetectRef: ChangeDetectorRef) {
  }

  static generateLinePath(firstPoint: PointModel, lastPoint: PointModel): string {
    return `M${firstPoint.getX()},${firstPoint.getY()} L ${lastPoint.getX()},${lastPoint.getY()}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['link']) {
      const linkValue = changes['link'].currentValue;
      {
        this.targetPort = linkValue.getSourcePort();
        this.targetPort = linkValue.getTargetPort();
      }
    }
  }

  // componentWillUnmount(): void {
  //   if (this.sourceListener) {
  //     this.sourceListener.deregister();
  //   }
  //   if (this.targetListener) {
  //     this.targetListener.deregister();
  //   }
  // }

  installTarget() {
    if (this.targetListener) {
      this.targetListener.deregister();
    }

    if (!this.link.getTargetPort()) {
      return;
    }
    // @ts-ignore
    this.targetListener = this.link.getTargetPort().registerListener({
      reportInitialPosition: (event: BaseEntityEvent<BasePositionModel>) => {
        // this.forceUpdate();
        this.changeDetectRef.detectChanges();
      }
    });
  }

  installSource() {
    this.sourceListener && this.sourceListener.deregister();

    if (!this.link.getSourcePort()) {
      return;
    }
    // @ts-ignore
    this.sourceListener = this.link.getSourcePort().registerListener({
      reportInitialPosition: (event: BaseEntityEvent<BasePositionModel>) => {
        // this.forceUpdate();
        this.changeDetectRef.detectChanges();
      }
    });
  }

  enable() {
    const {link} = this;

    // only draw the link when we have reported positions
    if (link.getSourcePort() && !link.getSourcePort().reportedPosition) {
      return false;
    }
    if (link.getTargetPort() && !link.getTargetPort().reportedPosition) {
      return false;
    }
    return true;
  }

  //
  // componentDidUpdate(prevProps: Readonly<LinkProps>, prevState: Readonly<LinkState>, snapshot) {
  //   if (prevState.sourcePort !== this.state.sourcePort) {
  //     this.installSource();
  //   }
  //   if (prevState.targetPort !== this.state.targetPort) {
  //     this.installTarget();
  //   }
  // }
  //
  // componentDidMount(): void {
  //   if (this.link.getSourcePort()) {
  //     this.installSource();
  //   }
  //   if (this.link.getTargetPort()) {
  //     this.installTarget();
  //   }
  // }

  ngOnInit() {
    if (this.link.getSourcePort()) {
      this.installSource();
    }
    if (this.link.getTargetPort()) {
      this.installTarget();
    }
  }

  ngOnDestroy() {
    if (this.sourceListener) {
      this.sourceListener.deregister();
    }
    if (this.targetListener) {
      this.targetListener.deregister();
    }
  }
}
