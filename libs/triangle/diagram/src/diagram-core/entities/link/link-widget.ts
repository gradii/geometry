/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectorRef, Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges
} from '@angular/core';
import { BaseEntityEvent } from '../../../canvas-core/core-models/base-entity';
import { BasePositionModel } from '../../../canvas-core/core-models/base-position-model';
import { ListenerHandle } from '../../../canvas-core/core/base-observer';
import { ENGINE } from '../../../canvas-core/tokens';
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
    <svg:g x-link-widget [link]="link"></svg:g>

    <ng-template let-labelModel let-index="index" ngFor [ngForOf]="link.getLabels()">
      <svg:foreignObject class="foreignObject" [attr.key]="labelModel.getID()">
        <label-widget [label]="labelModel"
                      [index]="index"></label-widget>
      </svg:foreignObject>
    </ng-template>
  `,
  styles  : [
    `.foreignObject {
      pointer-events : none;
      overflow       : visible;
      x              : 0;
      y              : 0;
      width          : 100%;
      height         : 100%;
    }
    `
  ]
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
