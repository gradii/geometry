/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  ViewChild
} from '@angular/core';
import { DiagramEngine } from '../../diagram-engine';
import { LabelModel } from './label-model';
import { ENGINE } from '@gradii/diagram/canvas-core';

@Component({
  selector: 'label-widget, g[label-widget]',
  template: `
    <svg:foreignObject class="foreignObject"
                       [attr.key]="label.getID()"
    >
      <div class="label" #ref>
        <ng-template [ngTemplateOutlet]="engine.getFactoryForLabel(this.label).generateReactWidget({model: label})"
                     [ngTemplateOutletContext]="{event: {model: label}}"
        ></ng-template>
      </div>
    </svg:foreignObject>`,
  styles: [`
    .foreignObject {
      pointer-events: none;
      overflow: visible;
    }

    .label {
      display: inline-block;
      position: absolute;
    }
  `]
})
export class LabelWidget implements AfterViewChecked {
  @ViewChild('ref', {read: ElementRef, static: true})
  ref: ElementRef<any>;

  @Input()
  label: LabelModel;

  @Input()
  index: number;

  get canvas() {
    return this.engine.getCanvas();
  }

  constructor(
    @Inject(ENGINE) public engine: DiagramEngine,
    private ngZone: NgZone
  ) {
  }

  // ngOnInit() {
  //   window.requestAnimationFrame(this.calculateLabelPosition);
  // }

  ngAfterViewChecked() {
    this.ngZone.runOutsideAngular(() => {
      window.requestAnimationFrame(this.calculateLabelPosition);
    });
  }

  findPathAndRelativePositionToRenderLabel = (index: number): { path: SVGPathElement; position: number } => {
    // an array to hold all path lengths, making sure we hit the DOM only once to fetch this information
    const link = this.label.getParent();
    const lengths = link.getRenderedPath().map((path) => path.getTotalLength());

    // calculate the point where we want to display the label
    let labelPosition =
      lengths.reduce((previousValue, currentValue) => previousValue + currentValue, 0) *
      (index / (link.getLabels().length + 1));

    // find the path where the label will be rendered and calculate the relative position
    let pathIndex = 0;
    while (pathIndex < link.getRenderedPath().length) {
      if (labelPosition - lengths[pathIndex] < 0) {
        return {
          path: link.getRenderedPath()[pathIndex],
          position: labelPosition
        };
      }

      // keep searching
      labelPosition -= lengths[pathIndex];
      pathIndex++;
    }
  };

  calculateLabelPosition = () => {
    const found = this.findPathAndRelativePositionToRenderLabel(this.index + 1);
    if (!found) {
      return;
    }

    const {path, position} = found;

    const labelDimensions = {
      width: this.ref.nativeElement.offsetWidth,
      height: this.ref.nativeElement.offsetHeight
    };

    const pathCentre = path.getPointAtLength(position);

    const labelCoordinates = {
      x: pathCentre.x - labelDimensions.width / 2 + this.label.getOptions().offsetX,
      y: pathCentre.y - labelDimensions.height / 2 + this.label.getOptions().offsetY
    };

    this.ref.nativeElement.style.transform = `translate(${labelCoordinates.x}px, ${labelCoordinates.y}px)`;
  };

}
