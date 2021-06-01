/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { QueryList, ViewChildren } from '@angular/core';

import {
  CdkDropList, transferArrayItem, moveItemInArray, CdkDragDrop
} from '@angular/cdk/drag-drop';
import { asapScheduler } from 'rxjs';


@Component({
  selector: 'tri-demo-drag-and-drop-child-groups-with-monkey-patch',
  template: `
  <div cdkDropListGroup>
  <div class="example-container">
    <h2>To do</h2>

    <div
      cdkDropList
      [cdkDropListData]="todo"
      class="example-list"
      (cdkDropListDropped)="drop($event)"
      [cdkDropListConnectedTo]="dls"
    >
      <div class="example-box" *ngFor="let item of todo" cdkDrag>
        <div *ngIf="!isArray(item); else arrayView">{{item}}</div>
        <ng-template #arrayView>
          <div class="example-container">
            <div
              cdkDropList
              [cdkDropListData]="item"
              class="example-list"
              (cdkDropListDropped)="drop($event)"
              [cdkDropListConnectedTo]="dls"
            >
              <div class="example-box" *ngFor="let innerItem of item" cdkDrag>
                {{innerItem}}
              </div>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  </div>
</div>

<!-- Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license -->

  `,
  styleUrls: ['tri-demo-drag-and-drop-child-groups-with-monkey-patch.component.css'],
})
export class TriDemoDragAndDropChildGroupsWithMonkeyPatchComponent {
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

  @ViewChildren(CdkDropList)
  private dlq: QueryList<CdkDropList>;

  public dls: CdkDropList[] = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  isArray(item: any): boolean {
    return Array.isArray(item);
  }

  ngAfterViewInit() {
    const ldls: CdkDropList[] = [];

    this.dlq.forEach((dl) => {
      console.log('found DropList ' + dl.id);
      ldls.push(dl);
    });

    asapScheduler.schedule(() => { this.dls = ldls; });
  }
}
