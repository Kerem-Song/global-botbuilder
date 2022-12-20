import { Node } from '@components/data-display';
import { useRootState } from '@hooks';
import { IArrow, IBasicCard } from '@models';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';

import { useCardList } from '../../../hooks/client/cardList';
import { addArrow, appendNode, updateNode } from '../../../store/makingNode';
import { BotBuilderZoomBtn } from './BotBuilderZoomBtn';
import { LineContainer, updateLine } from './LineContainer';

export const Botbuilder = () => {
  const dispatch = useDispatch();
  const { getCardListQuery } = useCardList();
  const { data } = getCardListQuery;

  const canvasRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<string>('');
  const [scale, setScale] = useState(1.0);
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const arrows = useRootState((state) => state.makingNodeSliceReducer.present.arrows);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const nodeRef: React.MutableRefObject<(HTMLDivElement | null)[]> = useRef([]);
  const [isRendered, setIsRendered] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('wheel', (e) => {
      console.log(e);
      e.preventDefault();
    });

    window.addEventListener('wheel.impair', (e) => {
      console.log(e);
      e.preventDefault();
    });
  }, []);

  const handleAddArrows = (arrow: IArrow) => {
    if (!arrows.find((x) => x.start === arrow.start)) {
      dispatch(addArrow(arrow));
    }
  };

  const transformOptions = {
    limitToBounds: true,
    minScale: 0.25,
    maxScale: 2,
  };

  const zoomOut = () => {
    const ratio = 0.25;
    let v = scale - ratio;

    if (transformOptions.minScale > v) {
      v = transformOptions.minScale;
    }
    setScale(v);
  };

  const zoomIn = () => {
    let v = scale + 0.25;

    if (transformOptions.maxScale < v) {
      v = transformOptions.maxScale;
    }
    setScale(v);
  };

  const panning = (x: number, y: number) => {
    if (!canvasRef.current) {
      return;
    }

    canvasRef.current.style.left = `${
      parseInt(canvasRef.current.style.left) + x / scale
    }px`;
    canvasRef.current.style.top = `${
      parseInt(canvasRef.current.style.top) + y / scale
    }px`;
  };

  const outterMouseWheelHandler = (e: React.WheelEvent<HTMLDivElement>): void => {
    if (e.nativeEvent.deltaY > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
  };

  const outterMouseMoveHandler = (e: React.MouseEvent): void => {
    e.stopPropagation();
    isPanning && panning(e.movementX, e.movementY);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode('');
    if (e.buttons === 1) {
      setIsPanning(true);
    } else {
      setIsPanning(false);
    }
  };

  const botbuilderRef = useRef<HTMLDivElement | null>(null);
  const draggableRef = useRef<HTMLDivElement | null>(null);

  const handleNodeClick = (id: string) => {
    const nodes = document.querySelectorAll<HTMLDivElement>('.draggableNode');
    nodes.forEach((n) => {
      n.style.zIndex = `${Math.max(0, Number(n.style.zIndex) - 1)}`;
    });
    const nodeWrap = document.querySelector(`#node-${id}`)?.parentElement;
    if (nodeWrap) {
      nodeWrap.style.zIndex = `${nodes.length}`;
    }
    setSelectedNode(id);
  };

  const handleChatbubbleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const cardType = e.dataTransfer.getData('cardType');
    if (!cardType) {
      return;
    }
    const addCard: IBasicCard[] = [
      {
        title: '',
        thumbnail: cardType === 'text' ? undefined : { imageUrl: '' },
        description: '',
        buttons:
          cardType === 'text' ? undefined : [{ label: 'add a button', action: 'block' }],
      },
    ];
    console.log(e.clientX, e.clientY);
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const addNode = {
      id: `${nodes.length + 1}`,
      x: e.clientX / scale - (canvasRect?.left || 0),
      y: e.clientY / scale - (canvasRect?.top || 0),
      title: cardType,
      cards: addCard,
    };

    dispatch(appendNode(addNode));

    if (!canvasRef.current) {
      return;
    }
  };

  const handleMakingChatBubbleClick = () => {
    if (!canvasRef.current) {
      return;
    }
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const translateX = (canvasRect.width - 310) / 2;
    const translateY = (canvasRect.height - 300) / 2;
    setPositionX(translateX);
    setPositionY(translateY);
  };

  // useEffect(() => {
  //   if (isRendered && nodeRef.current) {
  //     nodeRef.current[
  //       nodes.length - 1
  //     ]!.style.transform = `translate(${positionX}px, ${positionY}px)`;
  //     console.log('asdf', nodeRef.current[nodes.length - 1]);
  //   }
  //   setIsRendered(false);
  // }, [handleChatbubbleDrop, nodes]);

  return (
    <>
      <BotBuilderZoomBtn zoomIn={zoomIn} zoomOut={zoomOut} canvasScale={scale} />

      <div
        className="botBuilderMain"
        onWheel={(e) => outterMouseWheelHandler(e)}
        onMouseDown={(e) => handleCanvasClick(e)}
        onMouseMoveCapture={outterMouseMoveHandler}
        onMouseUp={(e) => handleCanvasClick(e)}
        ref={botbuilderRef}
        role="presentation"
        onDrop={(e) => {
          handleChatbubbleDrop(e);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        <div
          className="canvasWrapper"
          style={{ left: 0, top: 0, zoom: `${scale * 100}%` }}
          ref={canvasRef}
          role="presentation"
        >
          {nodes.map((item, i) => (
            <Draggable
              //defaultPosition={{}}
              position={{
                x: item.x,
                y: item.y,
              }}
              scale={scale}
              bounds={{ top: -4000, left: -4000, right: 4000 }}
              key={item.id}
              onDrag={(e) => {
                e.stopPropagation();
                //updateXarrow();
                updateLine(`node-${item.id}`);
              }}
              onStop={(e) => {
                const me = e as MouseEvent;
                const canvasRect = canvasRef.current?.getBoundingClientRect();
                const nodeRect = nodeRef.current[i]?.getBoundingClientRect();
                const node = {
                  ...item,
                  x: (nodeRect?.x || 0) - (canvasRect?.left || 0),
                  y: (nodeRect?.y || 0) - (canvasRect?.top || 0),
                };
                dispatch(updateNode(node));
              }}
              cancel=".node-draggable-ignore"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div
                role="presentation"
                className="draggableNode"
                style={{
                  // display: 'block',
                  position: 'absolute',
                  //zIndex: selectedNode === item.id ? 100 : 0,
                  // width: '100%',
                  // height: "100%",
                }}
                ref={(el) => (nodeRef.current[i] = el)}
              >
                <Node
                  id={item.id}
                  key={item.id}
                  title={item.title}
                  cards={item.cards}
                  active={selectedNode === item.id}
                  onClick={(e) => handleNodeClick(item.id!)}
                  addArrow={(from, to) => {
                    handleAddArrows({ start: from, end: to });
                  }}
                />
              </div>
            </Draggable>
          ))}
          <LineContainer lines={arrows} />
          {/* {arrows.map((x, i) => (
              <Xarrow
                key={i}
                path={'grid'}
                start={x.start}
                end={x.end}
                endAnchor={{ position: 'top', offset: { x: 0, y: 200 } }}
                startAnchor={{ position: 'bottom', offset: { x: 0, y: 0 } }}
                // _cpy1Offset={250}
                // _cpy2Offset={-250}
                // _cpx1Offset={250}
                // _cpx2Offset={-250}
                dashness
                color="#00B4ED"
                strokeWidth={3}
                curveness={0.1}
                headShape={{
                  svgElem: (
                    <path
                      d="M 0 0 L 1 0.5 L 0 1 M 0 0 z"
                      stroke="#00B4ED"
                      strokeWidth={0.1}
                      fill="none"
                      style={{ transform: 'translate(90)' }}
                    />
                  ),
                  offsetForward: 1,
                }}
              />
            ))} */}
        </div>
      </div>
    </>
  );
};
