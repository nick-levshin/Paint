import { makeAutoObservable } from 'mobx';
import { ICanvas } from '../types/canvas';

class CanvasState implements ICanvas {
  canvas: HTMLCanvasElement | null = null;
  socket: WebSocket | null = null;
  sessionid: string | null = null;
  undoList: Array<string> = [];
  redoList: Array<string> = [];
  username: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setSessionId(id: string) {
    this.sessionid = id;
  }

  setSocket(socket: WebSocket) {
    this.socket = socket;
  }

  setCanvas(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas;
  }

  setUsername(name: string) {
    this.username = name;
  }

  undo() {
    const ctx = this.canvas?.getContext('2d');
    if (this.undoList.length) {
      const dataUrl = this.undoList.pop();
      this.redoList.push(this.canvas?.toDataURL() as string);
      const img = new Image();
      img.src = dataUrl as string;
      img.onload = () => {
        ctx?.clearRect(
          0,
          0,
          this.canvas?.width as number,
          this.canvas?.height as number
        );
        ctx?.drawImage(
          img,
          0,
          0,
          this.canvas?.width as number,
          this.canvas?.height as number
        );
      };
    } else {
      ctx?.clearRect(
        0,
        0,
        this.canvas?.width as number,
        this.canvas?.height as number
      );
    }
  }

  redo() {
    const ctx = this.canvas?.getContext('2d');
    if (this.redoList.length) {
      const dataUrl = this.redoList.pop();
      this.undoList.push(dataUrl as string);
      const img = new Image();
      img.src = dataUrl as string;
      img.onload = () => {
        ctx?.clearRect(
          0,
          0,
          this.canvas?.width as number,
          this.canvas?.height as number
        );
        ctx?.drawImage(
          img,
          0,
          0,
          this.canvas?.width as number,
          this.canvas?.height as number
        );
      };
    }
  }

  pushToUndo(data: string) {
    this.undoList.push(data);
  }

  pushToRedo(data: string) {
    this.redoList.push(data);
  }
}

export default new CanvasState();
