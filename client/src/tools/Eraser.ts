import Brush from './Brush';

export default class Eraser extends Brush {
  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false;
    if (this.ctx) {
      this.ctx.strokeStyle = 'Black';
    }
  }

  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true;
    this.ctx?.beginPath();
    if (this.ctx) {
      this.ctx.strokeStyle = 'White';
    }
    this.ctx?.moveTo(
      e.pageX - (e.target as HTMLElement).offsetLeft,
      e.pageY - (e.target as HTMLElement).offsetTop
    );
  }
}
