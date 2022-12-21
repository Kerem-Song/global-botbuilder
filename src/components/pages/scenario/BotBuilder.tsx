import { Node } from '@components/data-display';
import { useRootState } from '@hooks';
import { IArrow, IBasicCard, ICommerceCard, INode } from '@models';
import { setSelected, zoomIn, zoomOut } from '@store/botbuilderSlice';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { useCardList } from '../../../hooks/client/cardList';
import { addArrow, appendNode, removeItem, updateNode } from '../../../store/makingNode';
import { BotBuilderZoomBtn } from './BotBuilderZoomBtn';
import { LineContainer, updateLine } from './LineContainer';

export const Botbuilder = () => {
  const dispatch = useDispatch();

  const botbuilderRef = useRef<HTMLDivElement | null>(null);
  const canvasRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const nodeRef: React.MutableRefObject<(HTMLDivElement | null)[]> = useRef([]);

  const [isPanning, setIsPanning] = useState<boolean>(false);

  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const arrows = useRootState((state) => state.makingNodeSliceReducer.present.arrows);
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const selected = useRootState((state) => state.botBuilderReducer.selected);

  const { getCardListQuery } = useCardList();
  const { data } = getCardListQuery;

  useEffect(() => {
    const event = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        dispatch(removeItem(selected));
        dispatch(setSelected());
      }
    };
    window.addEventListener('keydown', event);

    return () => {
      window.removeEventListener('keydown', event);
    };
  }, [selected]);

  const handleAddArrows = (arrow: IArrow) => {
    dispatch(addArrow(arrow));
  };

  const handleZoomOut = useCallback(() => {
    dispatch(zoomOut());
  }, []);

  const handleZoomIn = useCallback(() => {
    dispatch(zoomIn());
  }, []);

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
      handleZoomOut();
    } else {
      handleZoomIn();
    }
  };

  const outterMouseMoveHandler = (e: React.MouseEvent): void => {
    e.stopPropagation();
    isPanning && panning(e.movementX, e.movementY);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setSelected());
    if (e.buttons === 1) {
      setIsPanning(true);
    } else {
      setIsPanning(false);
    }
  };

  const handleNodeClick = (id: string) => {
    const nodeElements = document.querySelectorAll<HTMLDivElement>('.draggableNode');
    nodeElements.forEach((n) => {
      n.style.zIndex = `${Math.max(0, Number(n.style.zIndex) - 1)}`;
    });
    const nodeWrap = document.querySelector(`#node-${id}`)?.parentElement;
    if (nodeWrap) {
      nodeWrap.style.zIndex = `${nodeElements.length}`;
    }
    dispatch(setSelected(id));
  };

  const handleChatbubbleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const cardType = e.dataTransfer.getData('cardType');
    if (!cardType) {
      return;
    }
    let addCard: IBasicCard[] | ICommerceCard[] = [];

    switch (cardType) {
      case 'Text':
      case 'Image':
      case 'Button Template':
        addCard = [
          {
            title: cardType === 'Image' ? undefined : '',
            thumbnail: cardType === 'Text' ? undefined : { imageUrl: '' },
            description: cardType === 'Image' ? undefined : '',
            buttons:
              cardType === 'Text' || cardType === 'Image'
                ? undefined
                : [{ label: 'Button 01', action: 'block' }],
          },
        ];
        break;

      case 'Commerce':
        addCard = [
          {
            price: 0,
            currency: 'USD', // 파트너스센터 설정에 따라 코드 변경 필요
            thumbnail: { imageUrl: '' },
            profile: { brandName: '', imageUrl: '' },
            productName: '',
            // discount: 100,
          },
        ];
        break;
    }

    const canvasRect = canvasRef.current?.getBoundingClientRect() || new DOMRect();
    const addNode = {
      id: uuidv4(),
      x: e.clientX / scale - canvasRect.left,
      y: e.clientY / scale - canvasRect.top,
      title: cardType,
      cards: addCard,
    };

    dispatch(appendNode(addNode));
  };

  const handleUpdateNodePosition = (index: number, item: INode) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const nodeRect = nodeRef.current[index]?.getBoundingClientRect();
    const x = (nodeRect?.x || 0) - (canvasRect?.left || 0);
    const y = (nodeRect?.y || 0) - (canvasRect?.top || 0);
    if (x === item.x && y === item.y) {
      return;
    }
    const node = {
      ...item,
      x,
      y,
    };
    dispatch(updateNode(node));
  };

  return (
    <>
      <BotBuilderZoomBtn />

      <div
        className="botBuilderMain"
        onWheel={outterMouseWheelHandler}
        onMouseDown={handleCanvasClick}
        onMouseMoveCapture={outterMouseMoveHandler}
        onMouseUp={handleCanvasClick}
        ref={botbuilderRef}
        role="presentation"
        onDrop={handleChatbubbleDrop}
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
              position={{
                x: item.x,
                y: item.y,
              }}
              scale={scale}
              bounds={{ top: -4000, left: -4000, right: 4000 }}
              key={item.id}
              onDrag={(e) => {
                e.stopPropagation();
                updateLine(`node-${item.id}`);
              }}
              onStop={() => {
                handleUpdateNodePosition(i, item);
              }}
              cancel=".node-draggable-ignore"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div
                role="presentation"
                className="draggableNode"
                style={{
                  position: 'absolute',
                }}
                ref={(el) => (nodeRef.current[i] = el)}
              >
                <Node
                  id={item.id}
                  key={item.id}
                  title={item.title}
                  cards={item.cards}
                  active={selected === item.id}
                  onClick={() => handleNodeClick(item.id)}
                  addArrow={(from, to) => {
                    handleAddArrows({ start: from, end: to });
                  }}
                />
              </div>
            </Draggable>
          ))}
          <LineContainer lines={arrows} />
        </div>
      </div>
    </>
  );
};
