import React from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/toolbar.scss';
import Brush from '../tools/Brush';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Rect from '../tools/Rect';
import Line from '../tools/Line';

const Toolbar: React.FC = () => {
  const changeColor = (e: React.FormEvent<HTMLInputElement>) => {
    toolState.setFillColor(e.currentTarget.value);
    toolState.setStrokeColor(e.currentTarget.value);
  };

  const download = () => {
    const dataUrl = canvasState.canvas?.toDataURL() as string;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = canvasState.sessionid + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="toolbar">
      <button
        className="toolbar__btn brush"
        onClick={() =>
          toolState.setTool(
            new Brush(
              canvasState.canvas as HTMLCanvasElement,
              canvasState.socket as WebSocket,
              canvasState.sessionid as string
            )
          )
        }
      ></button>
      <button
        className="toolbar__btn rect"
        onClick={() =>
          toolState.setTool(
            new Rect(
              canvasState.canvas as HTMLCanvasElement,
              canvasState.socket as WebSocket,
              canvasState.sessionid as string
            )
          )
        }
      ></button>
      <button
        className="toolbar__btn circle"
        onClick={() =>
          toolState.setTool(
            new Circle(
              canvasState.canvas as HTMLCanvasElement,
              canvasState.socket as WebSocket,
              canvasState.sessionid as string
            )
          )
        }
      ></button>
      <button
        className="toolbar__btn line"
        onClick={() =>
          toolState.setTool(
            new Line(
              canvasState.canvas as HTMLCanvasElement,
              canvasState.socket as WebSocket,
              canvasState.sessionid as string
            )
          )
        }
      ></button>
      <button
        className="toolbar__btn eraser"
        onClick={() =>
          toolState.setTool(
            new Eraser(
              canvasState.canvas as HTMLCanvasElement,
              canvasState.socket as WebSocket,
              canvasState.sessionid as string
            )
          )
        }
      ></button>
      <input type="color" onChange={changeColor} />
      <button
        className="toolbar__btn undo"
        onClick={() => canvasState.undo()}
      ></button>
      <button
        className="toolbar__btn redo"
        onClick={() => canvasState.redo()}
      ></button>
      <button className="toolbar__btn save" onClick={() => download()}></button>
    </div>
  );
};

export default Toolbar;
