import { InterpolateObject } from '../interpolate/object';

export function interpolateObject(start, end) {
  return t => {
    return new InterpolateObject().interpolate(start, end).getResult(t);
  };
}
