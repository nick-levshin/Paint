import Tool from './Tool';

export default class Line extends Tool {
  private mouseDown: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
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
      this.draw(this.startX, this.startY, currentX, currentY);
    }
  }

  draw(x: number, y: number, x1: number, y1: number) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx?.beginPath();
      this.ctx?.moveTo(x, y);
      this.ctx?.lineTo(x1, y1);
      this.ctx?.stroke();
    };
  }
}
