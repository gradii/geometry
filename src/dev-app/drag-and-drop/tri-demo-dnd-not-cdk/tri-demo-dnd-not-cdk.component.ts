/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, QueryList, ViewChildren } from '@angular/core';
import { moveItemInArray, transferArrayItem, TriDragDrop, TriDropContainer } from '@gradii/triangle/dnd';
import { asapScheduler } from 'rxjs';

@Component({
  selector : 'tri-demo-dnd-not-Tri',
  template : `
    <div triDropListGroup>
      <div class="example-container">
        <h2>To do</h2>

        <div
          triDropList
          [triDropListData]="todo"
          class="example-list"
          (triDropListDropped)="drop($event)"
          [triDropListConnectedTo]="dls"
        >
          <div class="example-box" *ngFor="let item of todo" triDrag>
            <div *ngIf="!isArray(item); else arrayView">{{item}}</div>
            <ng-template #arrayView>
              <div class="example-container">
                <div
                  triDropList
                  [triDropListData]="item"
                  class="example-list"
                  (triDropListDropped)="drop($event)"
                  [triDropListConnectedTo]="dls"
                >
                  <div class="example-box" *ngFor="let innerItem of item" triDrag>
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
  styleUrls: ['tri-demo-dnd-not-cdk.component.css']
})
export class TriDemoDndNotTriComponent {
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

  @ViewChildren(TriDropContainer)
  private dlq: QueryList<TriDropContainer>;

  public dls: TriDropContainer[] = [];

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
    const ldls: TriDropContainer[] = [];

    this.dlq.forEach((dl) => {
      console.log('found DropList ' + dl.id);
      ldls.push(dl);
    });

    asapScheduler.schedule(() => {
      this.dls = ldls;
    });
  }
}
