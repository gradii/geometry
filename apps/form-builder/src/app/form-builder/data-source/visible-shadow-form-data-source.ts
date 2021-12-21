import { BehaviorSubject } from 'rxjs';
import { ShadowForm } from '../shadow-form';
import { ShadowFormLayoutViewer } from './shadow-form-layout-viewer';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';


@Injectable()
export class VisibleShadowFormDataSource {

  dataSource = new BehaviorSubject<ShadowForm[]>([]);

  constructor() {
  }

  connect(shadowFormLayoutView: ShadowFormLayoutViewer) {
    return this.dataSource.pipe(
      switchMap((sfList) => {
        return shadowFormLayoutView.viewChange.pipe(
          map((selectList) => {
            if (selectList.includes('*') || selectList.length === 0) {
              return sfList;
            }
            return sfList.filter(sf => selectList.includes(sf.name));
          })
        );
      })
    );
  }

  disconnect(shadowFormLayoutView: ShadowFormLayoutViewer) {
  }
}
