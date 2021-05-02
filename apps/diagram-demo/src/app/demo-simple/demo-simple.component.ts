import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DefaultLinkModel } from 'src/diagram/src/defaults/default-link-model';
import { DefaultNodeModel } from '../../../../../src/diagram/src/defaults/default-node-model';
import { DiagramModel } from '../../../../../src/diagram/src/diagram-core/models/diagram-model';


@Component({
  selector: 'demo-simple',
  template: `
    <h3>demo simple</h3>
    <div class="container" style="width: 800px; height: 400px">
      <diagram-engine [engineModel]="model"></diagram-engine>
    </div>
  `,
  styleUrls: ['./demo-simple.scss']
})
export class DemoSimpleComponent implements AfterViewInit, OnInit {

  model = new DiagramModel();

  ngOnInit() {

    // 2) setup the diagram model
    // let model = new DiagramModel();
    const model = this.model;

    // 3-A) create a default node
    let node1 = new DefaultNodeModel({
      name: 'Node 1',
      color: 'rgb(0,192,255)'
    });
    node1.setPosition(100, 100);
    let port1 = node1.addOutPort('Out');

    // 3-B) create another default node
    let node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
    let port2 = node2.addInPort('In');
    node2.setPosition(400, 100);

    // link the ports
    let link1 = port1.link<DefaultLinkModel>(port2);
    link1.testName = 'Test';
    link1.addLabel('Hello World!');

    // 4) add the models to the root graph
    model.addAll(node1, node2, link1);

  }

  ngAfterViewInit() {
  }


}
