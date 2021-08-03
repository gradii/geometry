/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InterpolateCubehelix, InterpolateCubehelixLong } from '../interpolate/cubehelix';


export function interpolateCubehelixFactory(gramma: number) {
  return (start, end) => {
    return t => {
      return new InterpolateCubehelix(gramma).interpolate(start, end).getResult(t);
    };
  };
}

export function interpolateCubehelixLongFactory(gramma: number) {
  return (start, end) => {
    return t => {
      return new InterpolateCubehelixLong(gramma).interpolate(start, end).getResult(t);
    };
  };
}

export function interpolateCubehelix(start, end, gramma?: number) {
  return t => {
    return new InterpolateCubehelix(gramma).interpolate(start, end).getResult(t);
  };
}

export function interpolateCubehelixLong(start, end, gramma?: number) {
  return t => {
    return new InterpolateCubehelixLong(gramma).interpolate(start, end).getResult(t);
  };
}
