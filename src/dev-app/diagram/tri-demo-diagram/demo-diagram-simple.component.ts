/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DiagramLinkModel, DiagramNodeModel, DiagramModel } from '@gradii/triangle/diagram';


@Component({
  selector: 'demo-simple',
  template: `
    <h3>demo simple</h3>
    <p>
      hold on \`shift \` to rect select
    </p>
    <div class="container" style="width: 800px; height: 400px">
      <tri-diagram [engineModel]="model" (selection)="onSelectionChanged($event)"></tri-diagram>
    </div>
  `,
  styleUrls: ['demo-diagram-simple.component.css']
})
export class DemoDiagramSimpleComponent implements AfterViewInit, OnInit {

  model = new DiagramModel();

  ngOnInit() {

    // 2) setup the diagram model
    // let model = new DiagramModel();
    const model = this.model;

    // 3-A) create a default node
    const node1 = new DiagramNodeModel({
      name: 'Node 1',
      color: 'rgb(0,192,255)'
    });
    node1.setPosition(100, 100);
    const port1 = node1.addOutPort('Out');

    // 3-B) create another default node
    const node2 = new DiagramNodeModel('Node 2', 'rgb(192,255,0)');
    const port2 = node2.addInPort('In');
    node2.setPosition(400, 100);

    // link the ports
    const link1 = port1.link<DiagramLinkModel>(port2);
    link1.labelName = 'Test';
    link1.addLabel('Hello World!');

    // 4) add the models to the root graph
    model.addAll(node1, node2, link1);

  }

  onSelectionChanged(event) {
    console.log(event);
  }

  ngAfterViewInit() {
  }


}
