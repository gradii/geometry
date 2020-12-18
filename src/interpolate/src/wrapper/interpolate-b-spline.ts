import { InterpolateBSpline } from '../interpolate/b-spline';

export function interpolateBSpline(values) {
  return t => {
    return new InterpolateBSpline().interpolate(values).getResult(t);
  };
}
