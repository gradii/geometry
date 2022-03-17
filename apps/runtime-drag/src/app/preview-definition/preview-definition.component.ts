import { Component, OnInit } from '@angular/core';
import { Definitions } from './definitions';
import { Slots } from './slots';

@Component({
  selector   : 'applications-preview-definition',
  templateUrl: './preview-definition.component.html',
  styleUrls  : ['./preview-definition.component.scss']
})
export class PreviewDefinitionComponent implements OnInit {

  public definition = Definitions;
  public slots      = Slots;

  data = ``;

  constructor() {
  }

  ngOnInit(): void {
    const slot = this.buildTree();
    console.log(slot);
  }

  #_findSlots(parentComponentId: string) {
    return this.slots.filter(it => it.parentComponentId === parentComponentId);
  }

  #_findComponents(parentSlotId: string) {
    return this.definition.filter(it => it.parentSlotId === parentSlotId);
  }

  buildTree() {
    const slot = this.slots.find(it => it.parentPageId === '1');
    return this.buildSlot(slot);
  }

  buildSlot(slot: any) {
    const components = this.#_findComponents(slot.id);
    components.forEach(component => {
      this.buildComponent(component);
    });
    slot.children = components;
    return slot;
  }

  buildComponent(component: any) {
    const slots = this.#_findSlots(component.id);
    slots.forEach(slot => {
      this.buildSlot(slot);
      const slotName      = slot.name + 'Slot';
      component[slotName] = slot;
    });
    return component;
  }


  onDragDropped(event: any) {

  }
}
