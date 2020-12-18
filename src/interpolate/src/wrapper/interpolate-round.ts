import { InterpolateRound } from '../interpolate/round';

export function interpolateRound(a, b) {
  return t => {
    return new InterpolateRound().interpolate(a, b).getResult(t);
  };
}
