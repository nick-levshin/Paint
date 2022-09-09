import Tool from './Tool';

export default class Brush extends Tool {
  protected mouseDown: boolean;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    super(canvas, socket, id);
    this.mouseDown = false;
    this.listen();
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  mouseUpHandler(e: MouseEvent) {
    this.mouseDown = false;
    this.socket.send(
      JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'finish',
          x: e.pageX - (e.target as HTMLElement).offsetLeft,
          y: e.pageY - (e.target as HTMLElement).offsetTop,
        },
      })
    );
  }

  mouseDownHandler(e: MouseEvent) {
    this.mouseDown = true;
    this.ctx?.beginPath();
    this.ctx?.moveTo(
      e.pageX - (e.target as HTMLElement).offsetLeft,
      e.pageY - (e.target as HTMLElement).offsetTop
    );
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      this.socket.send(
        JSON.stringify({
          method: 'draw',
          id: this.id,
          figure: {
            type: 'brush',
            x: e.pageX - (e.target as HTMLElement).offsetLeft,
            y: e.pageY - (e.target as HTMLElement).offsetTop,
            color: this.ctx?.fillStyle,
          },
        })
      );
    }
  }

  static draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) {
    ctx.strokeStyle = color;
    ctx?.lineTo(x, y);
    ctx?.stroke();
  }
}
