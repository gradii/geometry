/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { TriDragDrop } from '@gradii/triangle/dnd';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../models/item';

@Component({
  selector   : 'list-item',
  templateUrl: './list-item.html',
  styleUrls  : ['./list-item.scss']
})
export class ListItemComponent {
  @Input() item: Item;
  @Input() parentItem?: Item;

  @Input()
  public set connectedDropContainersIds(ids: string[]) {
    this.allDropContainersIds = ids;
  }

  public get connectedDropContainersIds(): string[] {
    return this.allDropContainersIds.filter((id) => id !== this.item.uId);
  }

  public allDropContainersIds: string[];

  public get dragDisabled(): boolean {
    return !this.parentItem;
  }

  public get parentItemId(): string {
    return this.dragDisabled ? '' : this.parentItem.uId;
  }

  @Output() itemDrop: EventEmitter<TriDragDrop<Item>>;

  constructor() {
    this.allDropContainersIds = [];
    this.itemDrop             = new EventEmitter();
  }

  public onDragDrop(event: TriDragDrop<Item, Item>): void {
    this.itemDrop.emit(event);
  }

}
