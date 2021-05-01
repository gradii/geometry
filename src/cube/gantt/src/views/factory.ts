/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { GanttViewType } from '../class/view-type';
import { GanttViewDay } from './day';
import { GanttViewMonth } from './month';
import { GanttViewQuarter } from './quarter';
import {
  GanttViewDate,
  GanttViewOptions
} from './view';


export function createViewFactory(type: GanttViewType, start: GanttViewDate, end: GanttViewDate,
                                  options?: GanttViewOptions) {
  switch (type) {
    case GanttViewType.month:
      return new GanttViewMonth(start, end, options);
    case GanttViewType.quarter:
      return new GanttViewQuarter(start, end, options);
    case GanttViewType.day:
      return new GanttViewDay(start, end, options);
    default:
      throw new Error('gantt view type invalid');
  }
}
