/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import {
  CompactType, GridTypes, moveItemInArray, transferArrayItem, TRI_DROP_CONTAINER, TriDragDrop,
  TriDragGridItemComponent, TriDropListContainer
} from '@gradii/triangle/dnd';
import { asapScheduler } from 'rxjs';
import { DisplayGrid, GridType } from '../../../../../../libs/triangle/gridster';


@Component({
  selector : 'tri-demo-dnd-grid',
  template : `
    <div>
      <div class="">
        <h2>To do</h2>

        <div>
          <h3>compact</h3>
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
              <tri-option label="Compact Down & Right" value="compactDown&Right">Compact Down &
                Right
              </tri-option>
              <tri-option label="Compact Right & Down" value="compactRight&Down">Compact Right &
                Down
              </tri-option>
            </tri-select>

            <span>has padding</span>
            <tri-checkbox [(ngModel)]="hasPadding">has Padding</tri-checkbox>
          </div>
        </div>
        <div>
          <h3>push options</h3>
          <div class="options-header">
            <tri-checkbox [(ngModel)]="options.pushItems" (ngModelChange)="changedOptions()">
              Push Items
            </tri-checkbox>
            <tri-checkbox [(ngModel)]="options.disablePushOnDrag"
                          (ngModelChange)="changedOptions()">
              Disable Push On Drag
            </tri-checkbox>
            <tri-checkbox [(ngModel)]="options.disablePushOnResize"
                          (ngModelChange)="changedOptions()">
              Disable Push On Resize
            </tri-checkbox>
            <tri-checkbox [(ngModel)]="options.pushDirections.north" *ngIf="options.pushDirections"
                          (ngModelChange)="changedOptions()">
              Push North
            </tri-checkbox>
            <tri-checkbox [(ngModel)]="options.pushDirections.east" *ngIf="options.pushDirections"
                          (ngModelChange)="changedOptions()">
              Push East
            </tri-checkbox>
            <tri-checkbox [(ngModel)]="options.pushDirections.south" *ngIf="options.pushDirections"
                          (ngModelChange)="changedOptions()">
              Push South
            </tri-checkbox>
            <tri-checkbox [(ngModel)]="options.pushDirections.west" *ngIf="options.pushDirections"
                          (ngModelChange)="changedOptions()">
              Push West
            </tri-checkbox>
            <tri-checkbox [(ngModel)]="options.pushResizeItems" (ngModelChange)="changedOptions()">
              Push Resize Items
            </tri-checkbox>
          </div>
        </div>

        <div>
          <h3>swap options</h3>
          <div>
            <tri-checkbox [(ngModel)]="options.swapItem" (ngModelChange)="changedOptions()">
              Swap
            </tri-checkbox>
            <!--            <tri-checkbox [(ngModel)]="options.dock" (ngModelChange)="changedOptions()">-->
            <!--              Dock-->
            <!--            </tri-checkbox>-->
            <!--            <tri-checkbox [(ngModel)]="options.swapThreshold" (ngModelChange)="changedOptions()">-->
            <!--              Swap threshold-->
            <!--            </tri-checkbox>-->
          </div>
        </div>

        <div>
          <h3>gridType</h3>
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

        <div>
          <h3>render Info</h3>
          <div>
            renderTileHeight
            {{gridContainer.renderTileHeight}}
            renderTileWidth
            {{gridContainer.renderTileWidth}}
          </div>
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

          <div triDropGridContainer #gridContainer="triDropGridContainer"
               [triDropGridContainerData]="dashboard"
               [triDropGridContainerGridType]="gridType"
               [triDropGridContainerHasPadding]="hasPadding"
               [triDropGridContainerCompactType]="compactType"
               [triDropGridContainerPushItems]="options.pushItems"
               [triDropGridContainerSwapItem]="options.swapItem"
               [triDropGridContainerRows]="8"
               [triDropGridContainerCols]="8"
               [triDropGridContainerMaxRows]="8"
               [triDropGridContainerMaxCols]="8"
               [triDropGridContainerGap]="12"
               [triDropGridContainerColumnGap]="8"
               (triDropGridContainerEntered)="onDragEntered($event)"
               (triDropGridContainerExited)="onDragExited($event)"
               (triDropGridContainerDropped)="onDragDropped($event)"
               [triDropGridContainerConnectedTo]="dls"
               class="example-grid-list" style="overflow: auto">
            <ng-template ngFor let-it let-i="index" [ngForOf]="dashboard">
              <tri-drag-grid-item #item
                                  #gridItem="triDragGridItem"
                                  [triDragGridItemIndex]="i"
                                  [triDragGridItemX]="it.x"
                                  [triDragGridItemY]="it.y"
                                  [triDragGridItemRows]="it.rows"
                                  [triDragGridItemCols]="it.cols"
                                  class="example-grid-box">
                <button (click)="item.resizeEnabled=!item.resizeEnabled">toggle resize</button>
                box{{i}}
                <div>
                  [renderX, renderY]: [{{gridItem.renderX}}, {{gridItem.renderY}}]
                </div>
                <div>
                  [renderRow, renderCol]: [{{gridItem.renderRows}}, {{gridItem.renderCols}}]
                </div>
                <div>
                  [x, y]: [{{gridItem.x}}, {{gridItem.y}}]
                </div>
                <div>
                  [col, row]: [{{it.cols}}, {{it.rows}}]
                </div>
                <div>
                  [x, y]: [{{it.x}}, {{it.y}}]
                </div>
              </tri-drag-grid-item>
            </ng-template>
          </div>

        </div>
      </div>
    </div>
  `,
  styleUrls: ['tri-demo-dnd-grid.component.scss']
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

  options: any = {
    gridType       : GridType.Fit,
    displayGrid    : DisplayGrid.Always,
    pushItems      : true,
    pushDirections : {north: true, east: true, south: true, west: true},
    pushResizeItems: false,
    swapItem       : false,
    draggable      : {
      enabled: true
    },
    resizable      : {
      enabled: true
    },
  };

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

  onDragDropped(event: TriDragDrop<any>) {
    console.log('dropped', event);
    if (!(event.item instanceof TriDragGridItemComponent)) {
      this.dashboard.push({
        x   : event.positionX,
        y   : event.positionY,
        cols: 1,
        rows: 1
      });
    } else {
      const item = this.dashboard[event.item.index];

      this.dashboard[event.item.index] = {...item, x: event.positionX, y: event.positionY};
    }
  }

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
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
