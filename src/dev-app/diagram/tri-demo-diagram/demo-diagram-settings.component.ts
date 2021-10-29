/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DiagramLinkModel, DiagramModel, DiagramNodeModel } from '@gradii/triangle/diagram';


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
            {{selection.name}}
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

  selection: any;

  ngOnInit() {

    // 2) setup the diagram model
    // let model = new DiagramModel();
    const model = this.model;

    // 3-A) create a default node
    let node1 = new DiagramNodeModel({
      name : 'Node 1',
      color: 'rgb(0,192,255)'
    });
    node1.setPosition(100, 100);
    let port1 = node1.addOutPort('Out');

    // 3-B) create another default node
    let node2 = new DiagramNodeModel('Node 2', 'rgb(192,255,0)');
    let port2 = node2.addInPort('In');
    node2.setPosition(400, 100);

    // link the ports
    let link1       = port1.link<DiagramLinkModel>(port2);
    link1.labelName = 'Test';
    link1.addLabel('Hello World!');

    // 4) add the models to the root graph
    model.addAll(node1, node2, link1);

  }

  onSelectionChange(selection: any[]) {
    if (selection.length > 0 && selection.length === 1) {
      this.selection = selection[0];
    } else {
      this.selection = undefined;
    }
  }

  ngAfterViewInit() {
  }


}
