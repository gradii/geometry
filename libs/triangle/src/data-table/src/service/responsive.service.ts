import {Injectable} from '@angular/core';
import {MediaMatcher, Breakpoints} from '@angular/cdk/layout';

const bootstrapToMedia = media =>
  ({
    xs: '(max-width: 576px)',
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 992px)',
    xl: '(min-width: 1200px)'
  }[media] || Breakpoints[media] || media);

@Injectable()
export class ResponsiveService {
  constructor(private mediaMatcher: MediaMatcher) {
  }

  matchesMedia(media: string): boolean {
    return !media || this.mediaMatcher.matchMedia(bootstrapToMedia(media)).matches;
  }
}
