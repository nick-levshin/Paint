import Tool from './Tool';

export default class Circle extends Tool {
  private mouseDown: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private radius: number = 0;
  private saved: string = '';

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    super(canvas, socket, id);
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
    this.startX = e.pageX - (e.target as HTMLElement).offsetLeft;
    this.startY = e.pageY - (e.target as HTMLElement).offsetTop;
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      let currentX = e.pageX - (e.target as HTMLElement).offsetLeft;
      let currentY = e.pageY - (e.target as HTMLElement).offsetTop;
      this.radius = Math.sqrt(
        (this.startX - currentX) ** 2 + (this.startY - currentY) ** 2
      );
      this.socket.send(
        JSON.stringify({
          method: 'draw',
          id: this.id,
          figure: {
            type: 'circle',
            x: this.startX,
            y: this.startY,
            radius: this.radius,
            color: this.ctx?.fillStyle,
          },
        })
      );
      this.draw(this.startX, this.startY, this.radius);
    }
  }

  draw(x: number, y: number, r: number) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx?.beginPath();
      this.ctx?.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx?.fill();
      this.ctx?.stroke();
    };
  }

  static staticDraw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx?.beginPath();
    ctx?.arc(x, y, r, 0, 2 * Math.PI);
    ctx?.fill();
    ctx?.stroke();
  }
}
