import React, { useEffect, useRef, useState } from 'react';
import '../styles/canvas.scss';
import { observer } from 'mobx-react-lite';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Msg } from '../types/msg';
import Circle from '../tools/Circle';

const Canvas: React.FC = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState(true);
  const params = useParams();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    const ctx = canvasRef.current?.getContext('2d');
    axios
      .get(`http://localhost:5000/image?id=${params.id}`)
      .then((res) => {
        const img = new Image();
        img.src = res.data;
        img.onload = () => {
          ctx?.clearRect(
            0,
            0,
            canvasRef.current?.width as number,
            canvasRef.current?.height as number
          );

          console.log(img);

          ctx?.drawImage(
            img,
            0,
            0,
            canvasRef.current?.width as number,
            canvasRef.current?.height as number
          );
        };
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket('ws://localhost:5000/');
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id as string);

      toolState.setTool(
        new Brush(
          canvasRef.current as HTMLCanvasElement,
          socket,
          params.id as string
        )
      );

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: 'connection',
          })
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case 'connection':
            console.log(`User ${msg.username} connected`);
            break;

          case 'draw':
            drawHandler(msg);
            break;
        }
      };
    }
  }, [canvasState.username]);

  const drawHandler = (msg: Msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D;

    if (figure?.type) {
      switch (figure.type) {
        case 'brush':
          Brush.draw(
            ctx as CanvasRenderingContext2D,
            figure.x,
            figure.y,
            figure.color
          );
          break;

        case 'rect':
          Rect.staticDraw(
            ctx as CanvasRenderingContext2D,
            figure.x,
            figure.y,
            figure?.width as number,
            figure?.height as number,
            figure.color
          );
          break;

        case 'circle':
          Circle.staticDraw(
            ctx as CanvasRenderingContext2D,
            figure.x,
            figure.y,
            figure?.radius as number,
            figure.color
          );
          break;

        case 'finish':
          ctx.beginPath();
          break;
      }
    }
  };

  const mouseDownHandler = () => {
    canvasState.pushToUndo(
      (canvasRef.current as HTMLCanvasElement).toDataURL()
    );
  };

  const mouseUpHandler = () => {
    axios
      .post(`http://localhost:5000/image?id=${params.id}`, {
        img: canvasRef.current?.toDataURL(),
      })
      .then((res) => console.log(res.data));
  };

  const connectHandler = () => {
    canvasState.setUsername((usernameRef.current as HTMLInputElement).value);
    setModal(false);
  };

  return (
    <>
      <div className="canvas">
        <Modal show={modal} onHide={() => setModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Your name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control ref={usernameRef} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => connectHandler()}>
              Connect
            </Button>
          </Modal.Footer>
        </Modal>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={mouseDownHandler}
          onMouseUp={mouseUpHandler}
        ></canvas>
      </div>
    </>
  );
});

export default Canvas;
