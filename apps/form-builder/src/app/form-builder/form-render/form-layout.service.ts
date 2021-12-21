import { Injectable } from '@angular/core';
import { ShadowForm } from '../shadow-form';


let gIndex = 0;

@Injectable()
export class FormLayoutService {
  debug = 'form render service';

  i;

  visibleShadowForms: ShadowForm[] = [];

  allShadowForms: ShadowForm[] = [];

  constructor() {
    this.i = ++gIndex;
  }

  findShadowFormFromName(name: string) {
    return this.allShadowForms.find(it => it.name === name);
  }
}
