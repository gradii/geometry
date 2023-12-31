/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit, HostBinding } from '@angular/core';
import { mockItems, mockGroups } from '../gantt/mocks';
import { GanttViewType, GanttPrintService } from '@gradii/cube/gantt';

@Component({
    selector: 'app-gantt-flat-example',
    templateUrl: './flat.component.html',
    styleUrls: ['./flat.component.scss'],
    providers: [GanttPrintService]
})
export class AppGanttFlatExampleComponent implements OnInit {
    constructor(
        private printService: GanttPrintService
    ) {}

    items = mockItems;

    groups = mockGroups;

    options = {
        viewType: GanttViewType.month,
        draggable: true,
        mergeIntervalDays: 3,
        styles: {
            lineHeight: 50
        }
    };

    @HostBinding('class.gantt-demo') class = true;

    ngOnInit(): void {}

    print(name: string) {
        this.printService.print(name);
    }
}
