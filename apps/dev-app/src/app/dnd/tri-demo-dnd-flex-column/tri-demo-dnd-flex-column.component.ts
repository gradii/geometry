/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import {
  moveItemInArray, transferArrayItem, TRI_DROP_CONTAINER, TriDragDrop, TriDropListContainer
} from '@gradii/triangle/dnd';
import { asapScheduler } from 'rxjs';

@Component({
  selector : 'tri-demo-dnd-grid',
  template : `
    <div triDropContainerGroup>
      <div class="example-container">
        <h2>To do</h2>

        <div style="display: flex; flex-direction: row; gap:10px">
          <div class="drag-example-list" style="width: 200px"
               triDragContainer
               [triDragContainerConnectedTo]="dls"
               (triDragContainerEntered)="onDragEntered($event)"
               (triDragContainerExited)="onDragExited($event)"
               (triDragContainerDropped)="onDragDropped($event)"
          >
            <div class="example-box" triDrag>
              <div>Pick up outside1</div>
            </div>
            <div class="example-box" triDrag>
              <div>Pick up outside2</div>
            </div>
            <div class="example-box" triDrag>
              <div>Pick up outside3</div>
            </div>
          </div>

          <div
            triDropFlexContainer
            triDropFlexContainerOrientation="vertical"
            [triDropFlexContainerData]="todo"
            class="example-list" style="width: 600px"
            (triDropFlexContainerDropped)="drop($event)"
            [triDropFlexContainerConnectedTo]="dls"
          >
            <div class="example-box" *ngFor="let item of todo" triDrag>
              <div *ngIf="!isArray(item); else arrayView">{{item}}</div>
              <ng-template #arrayView>
                <div class="example-container">
                  <div
                    triDropFlexContainer
                    triDropFlexContainerOrientation="vertical"
                    [triDropFlexContainerData]="item"
                    class="example-list container-example-list"
                    (triDropFlexContainerDropped)="drop($event)"
                    [triDropFlexContainerConnectedTo]="dls"
                  >
                    <div class="example-box container-example-box" *ngFor="let innerItem of item" triDrag>
                      {{innerItem}}
                    </div>
                  </div>
                </div>
              </ng-template>
            </div>
          </div>

        </div>

      </div>
    </div>
  `,
  styleUrls: ['./tri-demo-dnd-flex-column.component.scss']
})
export class TriDemoDndFlexColumnComponent implements AfterViewInit {
  boxItems = [
    'box1',
    'box2',
    'box3'
  ];

  todo = [
    'Get to work',
    [
      'Get up',
      'Brush teeth',
      'Take a shower',
      'Eat Breakfast',
      'Check e-mail',
      'Walk dog',
      'Naughty cat',
      'Nice man',
      'To Office',
      'Have Meeting'
    ],
    [

      'Preare for work',
      'Drive to office',
      'Üark car'
    ],
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  @ViewChildren(TRI_DROP_CONTAINER)
  private dlq: QueryList<TriDropListContainer>;

  public dls: TriDropListContainer[] = [];

  drop(event: TriDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data as string[], event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data as string[],
        event.container.data as string[],
        event.previousIndex,
        event.currentIndex);
    }
  }

  isArray(item: any): boolean {
    return Array.isArray(item);
  }

  onDragEntered(event) {
    console.log('entered', event);
  }

  onDragExited(event) {
    console.log('exited', event);
  }

  onDragDropped(event) {
    console.log('dropped', event);
  }

  ngAfterViewInit() {
    const ldls: TriDropListContainer[] = [];

    this.dlq.forEach((dl) => {
      console.log('found DropContainer ' + dl.id);
      ldls.push(dl);
    });

    asapScheduler.schedule(() => {
      this.dls = ldls;
    });
  }
}
