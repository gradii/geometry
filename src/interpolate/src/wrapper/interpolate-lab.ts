import { InterpolateLab } from '../interpolate/lab';

export function interpolateLab(start, end) {
  return t => {
    return new InterpolateLab().interpolate(start, end).getResult(t);
  };
}
