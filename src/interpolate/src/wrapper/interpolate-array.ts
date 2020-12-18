import { InterpolateArray } from '../interpolate/array';

export function interpolateArray(a: any[], b: any[]) {
  return t => {
    return new InterpolateArray().interpolate(a, b).getResult(t);
  };
}
