import { Injectable } from '@angular/core';

export interface GuideItem {
  id: string;
  name: string;
  document: string;
}

const GUIDES = [
  {
    id      : 'introduce',
    name    : 'Introduce',
    document: '/assets/documents/guides/triangle-introduce-triangle.html',
  },
  {
    id      : 'introduce-ng-zorro',
    name    : 'ng-zorro',
    document: '/assets/documents/guides/triangle-introduce-ng-zorro.html',
  },
];

@Injectable()
export class GuideItems {

  getAllItems(): GuideItem[] {
    return GUIDES;
  }

  getItemById(id: string): GuideItem {
    return GUIDES.find(i => i.id === id);
  }
}
