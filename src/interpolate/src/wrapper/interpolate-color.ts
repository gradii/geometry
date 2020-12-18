import { InterpolateColor } from '../interpolate/color';

export function interpolateColor(a, b) {
  return t => {
    return new InterpolateColor().interpolate(a, b).getResult(t);
  };
}
