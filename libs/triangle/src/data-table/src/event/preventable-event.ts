export class PreventableEvent {
  private prevented;
  constructor() {
    this.prevented = false;
  }

  preventDefault() {
    this.prevented = true;
  }

  isDefaultPrevented() {
    return this.prevented;
  }
}
