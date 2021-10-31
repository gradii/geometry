/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  DiagramLinkModel, DiagramModel, DiagramNodeModel, NodeModel
} from '@gradii/triangle/diagram';


@Component({
  selector : 'demo-settings',
  template : `
    <h3>demo simple</h3>
    <p>
      hold on \`shift \` to rect select
    </p>

    <div class="container" style="width: 800px; height: 400px">
      <tri-splitter>
        <tri-splitter-pane>
          <tri-diagram [engineModel]="model" (selection)="onSelectionChange($event)"></tri-diagram>
        </tri-splitter-pane>
        <tri-splitter-pane>
          <div *ngIf="selection else empty">
            <div>
              name: {{selection.name}}
              type: {{selection.type}}
            </div>
            <div>
              output transition:
              <ul>
                <li>{{this.getOutputTransition(this.selection)|json}}</li>
              </ul>
            </div>
            <div>
              input transition:
              <ul>
                <li>{{this.getInputTransition(this.selection)|json}}</li>
              </ul>
            </div>
          </div>

          <ng-template #empty>
            <div>Select a node to view...</div>
          </ng-template>

        </tri-splitter-pane>
      </tri-splitter>
    </div>
  `,
  styleUrls: ['demo-diagram-simple.component.css']
})
export class DemoDiagramSettingsComponent implements AfterViewInit, OnInit {

  model = new DiagramModel();

  selection: DiagramNodeModel;

  ngOnInit() {

    // 2) setup the diagram model
    // let model = new DiagramModel();
    const model = this.model;

    // 3-A) create a default node
    let node1 = new DiagramNodeModel({
      name : 'Start',
      color: 'rgb(167,23,23)',
      type : 'start'
    });
    node1.setPosition(100, 100);
    let port1 = node1.addOutPort('Out1', 'out1');

    let node2 = new DiagramNodeModel({
      name: 'End',
      color: 'rgb(200,255,36)',
      type: 'end'
    });
    let port2 = node2.addInPort('In1', 'in1');
    node2.setPosition(400, 100);

    let link1       = port1.link<DiagramLinkModel>(port2);
    link1.labelName = 'Test';
    link1.addLabel('Hello World!');


    model.addAll(node1, node2, link1);

    //-----

    let auditNode1 = new DiagramNodeModel('Audit1', 'rgb(36,222,255)');
    auditNode1.addInPort('audit1In1', 'Audit1In1');
    auditNode1.addOutPort('audit1Out1', 'Audit1Out1');
    auditNode1.setPosition(200, 200);

    model.addNode(auditNode1);


    let auditNode2 = new DiagramNodeModel('Audit2', 'rgb(36,222,255)');
    auditNode2.addInPort('audit2In1', 'Audit2In1');
    auditNode2.addOutPort('audit2Out1', 'Audit2Out1');
    auditNode2.setPosition(200, 250);

    model.addNode(auditNode2);
  }

  getInputTransition(node: DiagramNodeModel) {
    const transition: any = {};
    node.getInPorts().forEach(it => {
      const sourceNodeModels: DiagramNodeModel[] = [];
      it.getLinks().forEach(it => {
        const sourcePort = it.getSourcePort();
        const target     = sourcePort.getParent();
        sourceNodeModels.push(target as DiagramNodeModel);
      });
      transition[it.name] = sourceNodeModels.map(it => it.name);
    });
    return transition;
  }

  getOutputTransition(node: DiagramNodeModel) {
    const transition: any = {};
    node.getOutPorts().forEach(it => {
      const targetNodeModels: DiagramNodeModel[] = [];
      it.getLinks().forEach(it => {
        const targetPort = it.getTargetPort();
        const target     = targetPort.getParent();
        targetNodeModels.push(target as DiagramNodeModel);
      });
      transition[it.name] = targetNodeModels.map(it => it.name);
    });
    return transition;
  }

  onSelectionChange(selection: any[]) {
    selection = selection.filter(it => it instanceof NodeModel);

    if (selection.length > 0 && selection.length === 1) {
      this.selection = selection[0];
      console.log(this.selection);
    } else {
      this.selection = undefined;
    }
  }

  ngAfterViewInit() {
  }


}
