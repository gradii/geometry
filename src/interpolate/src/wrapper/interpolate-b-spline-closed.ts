import { InterpolateBSplineClosed } from '../interpolate/b-spline-closed';

export function interpolateBSplineClosed(values) {
  return t => {
    return new InterpolateBSplineClosed().interpolate(values).getResult(t);
  };
}
