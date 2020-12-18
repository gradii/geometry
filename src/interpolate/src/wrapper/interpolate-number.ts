import { InterpolateNumber } from '../interpolate/number';

export function interpolateNumber(start, end) {
  return t => {
    return new InterpolateNumber().interpolate(start, end).getResult(t);
  };
}
