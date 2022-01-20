import { PageNode } from './nodes/nodes';

export interface Slot {
  name: string;
  componentList: any[];
}

const EMPTY_ARRAY: any[] = [];

export class StoveGenerator {
  constructor(public model: PageNode) {
  }

  parse() {
    if (this.model) {
      this.firePage(this.model);
    }
  }

  fire() {
  }

  firePage(node: PageNode) {
    // const slots = [];
    // // if (node.slots) {
    // //   for (const type of Object.keys(node.slots)) {
    // //     const firedSlot = this.fireSlot({
    // //       name         : type,
    // //       componentList: node.slots[type]['componentList'] || EMPTY_ARRAY,
    // //     });
    // //
    // //     slots.push(firedSlot);
    // //   }
    // // }
    //
    // return {
    //   kind: 'page',
    //   slots
    // };
  }

  fireSlot(node: Slot) {
    return {};
  }

}
