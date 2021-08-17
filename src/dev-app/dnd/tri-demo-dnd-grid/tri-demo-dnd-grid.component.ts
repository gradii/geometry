/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import {
  CompactType, GridTypes, moveItemInArray, transferArrayItem, TRI_DROP_CONTAINER, TriDragDrop,
  TriDropListContainer
} from '@gradii/triangle/dnd';
import { asapScheduler } from 'rxjs';

@Component({
  selector : 'tri-demo-dnd-grid',
  template : `
    <div>
      <div class="">
        <h2>To do</h2>

        <div>
          <tri-select style="min-width: 200px" aria-label="Compact type" [(ngModel)]="compactType"
                      placeholder="Compact Type">
            <tri-option label="None" value="">None</tri-option>
            <tri-option label="Compact Up" value="compactUp">Compact Up</tri-option>
            <tri-option label="Compact Left" value="compactLeft">Compact Left</tri-option>
            <tri-option label="Compact Left & Up" value="compactLeft&Up">Compact Left & Up
            </tri-option>
            <tri-option label="Compact Up & Left" value="compactUp&Left">Compact Up & Left
            </tri-option>
            <tri-option label="Compact Right" value="compactRight">Compact Right</tri-option>
            <tri-option label="Compact Up & Right" value="compactUp&Right">Compact Up & Right
            </tri-option>
            <tri-option label="Compact Right & Up" value="compactRight&Up">Compact Right & Up
            </tri-option>
            <tri-option label="Compact Down" value="compactDown">Compact Down</tri-option>
            <tri-option label="Compact Down & Left" value="compactDown&Left">Compact Down & Left
            </tri-option>
            <tri-option label="Compact Left & Down" value="compactLeft&Down">Compact Left & Down
            </tri-option>
            <tri-option label="Compact Down & Right" value="compactDown&Right">Compact Down & Right
            </tri-option>
            <tri-option label="Compact Right & Down" value="compactRight&Down">Compact Right & Down
            </tri-option>
          </tri-select>

          <span>has padding</span>
          <tri-checkbox [(ngModel)]="hasPadding">has Padding</tri-checkbox>
        </div>

        <div>
          <span>gridType</span>
          <tri-select style="min-width: 200px" [(ngModel)]="gridType">
            <tri-option label="none" value=""></tri-option>
            <tri-option label="fit" value="fit"></tri-option>
            <tri-option label="scrollVertical" value="scrollVertical"></tri-option>
            <tri-option label="scrollHorizontal" value="scrollHorizontal"></tri-option>
            <tri-option label="fixed" value="fixed"></tri-option>
            <tri-option label="verticalFixed" value="verticalFixed"></tri-option>
            <tri-option label="horizontalFixed" value="horizontalFixed"></tri-option>
          </tri-select>
        </div>

        <div style="display: flex; flex-direction: row; gap:10px; height: 800px;">
          <div class="example-list"
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

          <div triDropGridContainer
               [triDropGridContainerGridType]="gridType"
               [triDropGridContainerHasPadding]="hasPadding"
               [triDropGridContainerCompactType]="compactType"
               [triDropGridContainerRows]="10"
               [triDropGridContainerCols]="10"
               [triDropGridContainerMaxRows]="10"
               [triDropGridContainerMaxCols]="10"
               (triDropGridContainerEntered)="onDragEntered($event)"
               (triDropGridContainerExited)="onDragExited($event)"
               (triDropGridContainerDropped)="onDragDropped($event)"
               [triDropGridContainerConnectedTo]="dls"
               class="example-grid-list">
            <tri-drag-grid-item *ngFor="let it of dashboard" #item="triDragGridItem"
                                [triDragGridItemX]="it.x"
                                [triDragGridItemY]="it.y"
                                [triDragGridItemRows]="it.rows"
                                [triDragGridItemCols]="it.cols"
                                class="example-grid-box">
              box0 col: {{it.cols}} row: {{it.rows}} x:{{item.x}} y:{{item.y}}
            </tri-drag-grid-item>

          </div>

        </div>

      </div>
    </div>
  `,
  styleUrls: ['tri-demo-dnd-grid.component.css']
})
export class TriDemoDndGridComponent implements AfterViewInit {
  hasPadding = true;
  compactType: CompactType;
  gridType: GridTypes;

  dashboard = [
    {cols: 1, rows: 1, y: 1, x: 1},
    {cols: 2, rows: 2, y: 0, x: 2},
    {cols: 1, rows: 1, y: 0, x: 4},
    {cols: 3, rows: 2, y: 1, x: 4},
    {cols: 1, rows: 1, y: 4, x: 5},
    {cols: 1, rows: 1, y: 2, x: 1},
    {cols: 2, rows: 2, y: 5, x: 5},
    {cols: 2, rows: 2, y: 3, x: 2},
    {cols: 2, rows: 1, y: 2, x: 2},
    {cols: 1, rows: 1, y: 3, x: 4},
    {cols: 1, rows: 1, y: 0, x: 6}
  ];

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
