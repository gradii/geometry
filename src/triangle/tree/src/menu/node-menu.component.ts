/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { isEscapePressed, isLeftButtonClicked } from '../utils/event.utils';
import { NodeMenuAction, NodeMenuItemAction, NodeMenuItemSelectedEvent } from './menu.events';
import { NodeMenuService } from './node-menu.service';

@Component({
  selector: 'node-menu',
  template: `
    <div class="node-menu">
      <ul tri-menu theme="dark" class="node-menu-content" #menuContainer>
        <li tri-menu-item class="node-menu-item" *ngFor="let menuItem of availableMenuItems"
            (click)="onMenuItemSelected($event, menuItem)">
          <tri-icon [svgIcon]="menuItem.icon"></tri-icon>
          <span class="node-menu-item-value">{{menuItem.name}}</span>
        </li>
      </ul>
    </div>
  `
})
export class NodeMenuComponent implements OnInit, OnDestroy {

  @Output()
  menuItemSelected: EventEmitter<NodeMenuItemSelectedEvent> = new EventEmitter<NodeMenuItemSelectedEvent>();

  @Input() menuItems: NodeMenuItem[];

  @ViewChild('menuContainer', {read: ElementRef, static: false}) menuContainer: any;

  availableMenuItems: NodeMenuItem[] = [
    {
      name    : 'New tag',
      action  : NodeMenuItemAction.NewTag,
      cssClass: 'new-tag'
    },
    {
      name    : 'New folder',
      action  : NodeMenuItemAction.NewFolder,
      cssClass: 'new-folder'
    },
    {
      name    : 'Rename',
      action  : NodeMenuItemAction.Rename,
      cssClass: 'rename'
    },
    {
      name    : 'Remove',
      action  : NodeMenuItemAction.Remove,
      cssClass: 'remove'
    }
  ];

  private disposersForGlobalListeners: Function[] = [];

  constructor(@Inject(Renderer2) private renderer: Renderer2,
                     @Inject(NodeMenuService) private nodeMenuService: NodeMenuService) {}

  ngOnInit(): void {
    this.availableMenuItems = this.menuItems || this.availableMenuItems;
    this.disposersForGlobalListeners.push(this.renderer.listen('document', 'keyup', this.closeMenu.bind(this)));
    this.disposersForGlobalListeners.push(this.renderer.listen('document', 'mousedown', this.closeMenu.bind(this)));
  }

  ngOnDestroy(): void {
    this.disposersForGlobalListeners.forEach((dispose: Function) => dispose());
  }

  onMenuItemSelected(e: MouseEvent, selectedMenuItem: NodeMenuItem): void {
    if (isLeftButtonClicked(e)) {
      this.menuItemSelected.emit({
        nodeMenuItemAction  : selectedMenuItem.action,
        nodeMenuItemSelected: selectedMenuItem.name
      });

      this.nodeMenuService.fireMenuEvent(e.target as HTMLElement, NodeMenuAction.Close);
    }
  }

  private closeMenu(e: MouseEvent | KeyboardEvent): void {
    const mouseClicked = e instanceof MouseEvent;
    // Check if the click is fired on an element inside a menu
    const containingTarget =
            this.menuContainer.nativeElement !== e.target && this.menuContainer.nativeElement.contains(e.target);

    if ((mouseClicked && !containingTarget) || isEscapePressed(e as KeyboardEvent)) {
      this.nodeMenuService.fireMenuEvent(e.target as HTMLElement, NodeMenuAction.Close);
    }
  }
}

export interface NodeMenuItem {
  name: string;
  action: NodeMenuItemAction;
  icon?: string;
  cssClass?: string;
}
