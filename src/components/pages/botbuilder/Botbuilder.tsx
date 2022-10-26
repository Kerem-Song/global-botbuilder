import './DraggablePage.scss';

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Xwrapper } from 'react-xarrows';
import { CSSProperties } from 'styled-components';

import { dummy } from '../../../dummy';
import { DraggableTemplate, TDraggable } from './draggable';

type TCanvasValue = { x: number; y: number; scale: number };
export const BotbuilderPage = () => {
  const [card, setCard] = useState<TDraggable[]>(dummy);
  const [cardRef, setCardRef] = useState<MutableRefObject<(HTMLDivElement | null)[]>>();
  const [canvasValue, setCanvasValue] = useState<TCanvasValue>({
    x: 0,
    y: 0,
    scale: 1.0,
  });
  const draggableWrapperRef = useRef<(HTMLDivElement | null)[]>([]);

  const canvasStyle: CSSProperties = {
    top: canvasValue.y,
    left: canvasValue.x,
    zoom: `${canvasValue.scale * 100}%`,
  };

  const handleMakeCard = (e: React.MouseEvent) => {
    e.preventDefault();
    setCard([
      ...card,
      {
        id: 'template' + Math.random(),
        title: '',
        description: '설명',
        buttons: [{ buttonId: '', name: '', endPoint: '' }],
      },
    ]);
  };

  const handleDeleteCard = (id: string) => {
    const sliced = card
      .filter((item) => item.id !== id)
      .map((cardItem) => ({
        ...cardItem,
        buttons: cardItem.buttons.map((button) => ({
          ...button,
          endPoint: button.endPoint === id ? '' : button.endPoint,
        })),
      }));

    console.log('sliced', sliced);
    setCard(sliced);
  };

  useEffect(() => {
    setCardRef(draggableWrapperRef);
  }, [card]);

  const transformOptions = {
    limitToBounds: false,
    minScale: 0.05,
    maxScale: 2,
  };

  const setZoomDefault = () => {
    setCanvasValue({ x: 0, y: 0, scale: 1 });
  };

  const panning = (x: number, y: number) => {
    // linkDrawState.current = false;
    setCanvasValue({
      x: canvasValue.x + x / canvasValue.scale,
      y: canvasValue.y + y / canvasValue.scale,
      scale: canvasValue.scale,
    });
  };

  const zoomOut = () => {
    const ratio = canvasValue.scale * 0.25;
    let v = canvasValue.scale - ratio;
    if (transformOptions.minScale > v) {
      v = transformOptions.minScale;
    }
    setCanvasValue({
      x: canvasValue.x,
      y: canvasValue.y,
      scale: v,
    });
  };

  const zoomIn = () => {
    let v = canvasValue.scale + 0.1;
    if (transformOptions.maxScale < v) {
      v = transformOptions.maxScale;
    }
    //linkDrawState.current = false;

    setCanvasValue({
      x: canvasValue.x,
      y: canvasValue.y,
      scale: v,
    });
  };

  const outterMouseWheelHandler = (e: React.WheelEvent<HTMLDivElement>): void => {
    console.log('outter mouse wheel handler', e.nativeEvent.deltaY);

    if (e.nativeEvent.deltaY > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
  };

  const handlePanning = (e: React.MouseEvent) => {
    console.log('panning@');
    // panning(e.movementX, e.movementY);
  };
  return (
    <>
      <button onClick={handleMakeCard}>카드 만들기</button>
      <Xwrapper>
        <div
          className="wrapper-test"
          // style={{ display: "block", width: "100%", height: "100vh" }}
          style={canvasStyle}
          onWheel={(e) => outterMouseWheelHandler(e)}
        >
          <Draggable bounds={{ top: 100, bottom: 1000, right: 1000, left: 0 }}>
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                width: '100%',
                // height: "100%",
              }}
            >
              {/* <Xwrapper> */}
              {card.map((item, i) => (
                <div
                  key={item.id}
                  className="draggableWrapper"
                  ref={(el) => (draggableWrapperRef.current[i] = el)}
                >
                  <DraggableTemplate
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    buttons={item.buttons}
                    deleteCard={handleDeleteCard}
                    cardRef={cardRef}
                  />
                </div>
              ))}
              {/* </Xwrapper> */}
            </div>
          </Draggable>
        </div>
      </Xwrapper>
    </>
  );
};
