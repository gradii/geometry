/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { DiagramEngine } from '@gradii/diagram/diagram-core';
import { DefaultLinkFactory } from './default-link-factory';
import { DefaultLinkModel } from './default-link-model';

// export interface DefaultLinkSegmentWidgetProps {
//   path: string;
//   link: DefaultLinkModel;
//   selected: boolean;
//   forwardRef: React.RefObject<SVGPathElement>;
//   factory: DefaultLinkFactory;
//   diagramEngine: DiagramEngine;
//   onSelection: (selected: boolean) => any;
//   extras: object;
// }


@Component({
  selector: 'g[default-link-segment-widget]',
  template: `
    <ng-template [ngTemplateOutlet]="factory.generateLinkSegment(
        link,
        selected || link.isSelected(),
        path
      )" [ngTemplateOutletContext]="{
        ref: ref,
        event: {
            model: link,
            selected: selected || link.isSelected(),
            stroke: (selected || link.isSelected()) ? link.getOptions().selectedColor : link.getOptions().color,
            path: path
        }
      }"></ng-template>
    <ng-template [ngTemplateOutlet]="factory.generateLinkSegment(
        link,
        selected || link.isSelected(),
        path
      )" [ngTemplateOutletContext]="{
        event: {
            model: link,
            selected: selected || link.isSelected(),
            stroke: (selected || link.isSelected()) ? link.getOptions().selectedColor : link.getOptions().color,
            path: path
        }
      }"></ng-template>
  `
})
export class DefaultLinkSegmentWidget {

  @Input() ref: (ref: SVGPathElement) => void;
  @Input() path: string;
  @Input() link: DefaultLinkModel;
  @Input() selected: boolean;
  @Input() forwardRef: ElementRef<SVGPathElement>;
  @Input() factory: DefaultLinkFactory;
  @Input() diagramEngine: DiagramEngine;
  @Input() extras: object;

  @Input() onSelection: (selected: boolean) => any;

  @Output() selection = new EventEmitter();

  renderHandle() {

    const topProps = {
      strokeLinecap: 'round',
      onMouseLeave: () => {
        this.onSelection(false);
      },
      onMouseEnter: () => {
        this.onSelection(true);
      },
      ...this.extras,
      ref: null,
      'data-linkid': this.link.getID(),
      strokeOpacity: this.selected ? 0.1 : 0,
      strokeWidth: 20,
      fill: 'none',
      onContextMenu: () => {
        if (!this.link.isLocked()) {
          event.preventDefault();
          this.link.remove();
        }
      }
    };


    // render() {
    //   const Bottom = React.cloneElement(
    //     this.factory.generateLinkSegment(
    //       this.link,
    //       this.selected || this.link.isSelected(),
    //       this.path
    //     ),
    //     {
    //       ref: this.forwardRef
    //     }
    //   );
    //
    //   const Top = React.cloneElement(Bottom, {
    //     strokeLinecap: 'round',
    //     onMouseLeave: () => {
    //       this.onSelection(false);
    //     },
    //     onMouseEnter: () => {
    //       this.onSelection(true);
    //     },
    //     ...this.extras,
    //     ref: null,
    //     'data-linkid': this.link.getID(),
    //     strokeOpacity: this.selected ? 0.1 : 0,
    //     strokeWidth: 20,
    //     fill: 'none',
    //     onContextMenu: () => {
    //       if (!this.link.isLocked()) {
    //         event.preventDefault();
    //         this.link.remove();
    //       }
    //     }
    //   });
    //
    //   return (
    //     <g>
    //       {Bottom}
    //       {Top}
    //     </g>
    //   );
    // }
  }
}