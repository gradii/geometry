/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { DiagramLinkModel } from '../../models/diagram-link-model';
import { DiagramEngine } from '../diagram-engine';

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
  selector: 'svg:g[x-link-segment-widget]',
  template: `

    <svg:path
      [attr.data-linkid]="this.link.getID()"
      [ref]="ref"
      [ngStyle]="(selected || link.isSelected()) ? {
        strokeDasharray: '10, 2',
		    animation: 'animation-selected 1s linear infinite'
      }: null"
      class="path"
      [attr.stroke]="((selected || link.isSelected()) ? link.selectedColor : link.color)"
      [attr.stroke-width]="link.width"
      [attr.d]="path"
    >
    </svg:path>

    <!--
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
      }"></ng-template>-->
    <!--
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
      -->
  `,
  styles  : [
    `
      .path {
        fill           : none;
        pointer-events : all;
      }
    `
  ]
})
export class XLinkSegmentWidget {

  @Input() ref: (ref: SVGPathElement) => void;
  @Input() path: string;
  @Input() link: DiagramLinkModel;
  @Input() selected: boolean;
  @Input() forwardRef: ElementRef<SVGPathElement>;
  // @Input() factory: DefaultLinkFactory;
  @Input() diagramEngine: DiagramEngine;
  @Input() extras: object;

  @Input() onSelection: (selected: boolean) => any;

  @Output() selection = new EventEmitter();

  renderHandle() {

    const topProps = {
      strokeLinecap: 'round',
      onMouseLeave : () => {
        this.onSelection(false);
      },
      onMouseEnter : () => {
        this.onSelection(true);
      },
      ...this.extras,
      // ref: null,
      'data-linkid': this.link.getID(),
      strokeOpacity: this.selected ? 0.1 : 0,
      strokeWidth  : 20,
      fill         : 'none',
      onContextMenu: (event: Event) => {
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
