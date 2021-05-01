/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { GanttDate } from '../utils/date';

export class GanttDatePoint {
  constructor(
    public start: GanttDate,
    public text: string,
    public x: number,
    public y: number,
    public additions?: {
      isWeekend: boolean;
      isToday: boolean;
    }
  ) {
  }
}
