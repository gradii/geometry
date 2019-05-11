import { Injectable } from '@angular/core';
import { ExpandStateService } from './expand-state.service';

@Injectable()
export class DetailsService extends ExpandStateService {
  constructor() {
    super(true);
  }
}
