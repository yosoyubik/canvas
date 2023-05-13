export default class Mousing {
  pressed: boolean;
  onCanvas: boolean;
  drawMode: boolean;

  constructor() {
    this.init();
  }

  init() {
    this.pressed = false;
    this.onCanvas = false;
    this.drawMode = true;
  }

  get active() {
    return this.onCanvas && this.pressed;
  }

  set active(active) {
    this.onCanvas = active;
    this.pressed = active;
  }
}
