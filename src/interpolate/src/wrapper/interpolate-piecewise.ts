import { InterpolatePiecewise } from '../interpolate/piecewise';

export function interpolatePiecewise(values, interpolate) {
  return t => {
    return new InterpolatePiecewise(interpolate).interpolate(values).getResult(t);
  };
}
