/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, QueryList, ViewChildren } from '@angular/core';
import {
  moveItemInArray, transferArrayItem, TriDragDrop, TriDropListContainer
} from '@gradii/triangle/dnd';
import { asapScheduler } from 'rxjs';

@Component({
  selector : 'tri-demo-dnd-placeholder',
  template : `
    <div triDropContainerGroup>
      <div class="example-container">
        <h2>placeholder</h2>

        <div
          triDropListContainer
          [triDropListContainerData]="todo"
          class="example-list"
          (triDropListContainerDropped)="drop($event)"
          [triDropListContainerConnectedTo]="dls"
        >
          <div class="example-box" *ngFor="let item of todo" triDrag>
            <div *ngIf="!isArray(item); else arrayView">{{item}}</div>
            <ng-template #arrayView>
              <div class="example-container">
                <div
                  triDropListContainer
                  [triDropListContainerData]="item"
                  class="example-list"
                  (triDropListContainerDropped)="drop($event)"
                  [triDropListContainerConnectedTo]="dls"
                >
                  <div class="example-box"
                       *ngFor="let innerItem of item"
                       triDrag
                  >
                    <ng-template triDragPlaceholder>
                      <div></div>
                    </ng-template>
                    {{innerItem}}
                  </div>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['tri-demo-dnd-placeholder.component.scss']
})
export class TriDemoDndPlaceholderComponent {
  todo = [
    'Get to work',
    [
      'Get up',
      'Brush teeth',
      'Take a shower',
      'Check e-mail',
      'Walk dog'
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

  @ViewChildren(TriDropListContainer)
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
