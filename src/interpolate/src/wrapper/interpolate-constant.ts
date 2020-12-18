import { InterpolateConstant } from '../interpolate/constant';

export function interpolateConstant(x) {
  return t => {
    return new InterpolateConstant(x).getResult(t);
  };
}
