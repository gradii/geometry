/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges
} from '@angular/core';
import { NavigationService } from './navigation/navigation.service';
import { SelectionService } from './selection/selection.service';
import { isSelected } from './default-callbacks';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({selector: '[triTreeViewItemContent]'})
export class TreeViewItemContentDirective implements OnChanges, OnDestroy {
  element: any;
  navigationService: any;
  selectionService: any;
  renderer: any;
  @Input()
  dataItem: any;
  @Input()
  index: string;
  @Input()
  initialSelection: boolean;
  @Input()
  isSelected: (item: object, index: string) => boolean;
  subscriptions: any;

  constructor(element: ElementRef, navigationService: NavigationService,
              selectionService: SelectionService, renderer: Renderer2) {
    this.element = element;
    this.navigationService = navigationService;
    this.selectionService = selectionService;
    this.renderer = renderer;
    this.initialSelection = false;
    this.isSelected = isSelected;
    this.subscriptions = new Subscription();
    this.subscriptions.add(this.navigationService.moves
      .subscribe(this.updateFocusClass.bind(this)));
    this.subscriptions.add(this.navigationService.selects
      .pipe(filter((index) => index === this.index))
      .subscribe((index) => this.selectionService.select(index, this.dataItem)));
    this.subscriptions.add(this.selectionService.changes
      .subscribe(() => {
        this.updateSelectionClass(this.isSelected(this.dataItem, this.index));
      }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.initialSelection) {
      this.updateSelectionClass(this.initialSelection);
    }
    if (changes.index) {
      this.updateFocusClass();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  updateFocusClass(): any {
    this.render(this.navigationService.isActive(this.index), 'k-focus');
  }

  updateSelectionClass(selected): any {
    this.render(selected, 'k-selected');
  }

  render(addClass, className): any {
    const action = addClass ? 'addClass' : 'removeClass';
    this.renderer[action](this.element.nativeElement, className);
  }
}
