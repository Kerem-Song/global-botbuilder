import { icCardPaste } from '@assets';
import { IPopperItem } from '@components/navigation';
import { useModalOpen, useRootState, useScenarioClient } from '@hooks';
import { useContextMenu } from '@hooks/useContextMenu';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { getNodeKind, IArrow, INode, TNodeTypes } from '@models';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setSelected, zoomIn, zoomOut } from '@store/botbuilderSlice';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';

import { ID_GEN, NODE_DRAG_FACTOR, NODE_PREFIX } from '../../../modules';
import { nodeHelper } from '../../../modules/nodeHelper';
import { addArrow, appendNode, removeItem, updateNode } from '../../../store/makingNode';
import { BotBuilderZoomBtn } from './BotBuilderZoomBtn';
import { NodeEditDrawer } from './edit/NodeEditDrawer';
import { LineContainer } from './LineContainer';
import { NodeLinkPopUpMenu } from './NodeLinkPopUpMenu';
import { Node } from './nodes';

let dirtySelect: string | undefined;

export const Botbuilder = () => {
  const dispatch = useDispatch();
  const { updateLine } = useUpdateLines();

  const botbuilderRef = useRef<HTMLDivElement | null>(null);
  const canvasRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const nodeRef: React.MutableRefObject<(HTMLDivElement | null)[]> = useRef([]);

  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [popUpPosition, setPopUpPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);

  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const isEditDrawerOpen = useRootState(
    (state) => state.botBuilderReducer.isEditDrawerOpen,
  );

  const clipBoard = useRootState((state) => state.botBuilderReducer.clipBoard);

  const { getScenario } = useScenarioClient();
  getScenario(selectedScenario?.id);

  const { isOpen, handleIsOpen } = useModalOpen();

  useEffect(() => {
    const event = () => {
      setIsPanning(false);
    };
    window.addEventListener('mouseup', event);
    return () => {
      window.removeEventListener('mouseup', event);
    };
  }, []);

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
    if (dirtySelect === id) {
      dirtySelect = undefined;
      return;
    }
    if (!isEditDrawerOpen) {
      const nodeElements = document.querySelectorAll<HTMLDivElement>('.draggableNode');
      nodeElements.forEach((n) => {
        n.style.zIndex = `${Math.max(1, Number(n.style.zIndex) - 1)}`;
      });
      const nodeWrap = document.querySelector(`#node-${id}`)?.parentElement;
      if (nodeWrap) {
        nodeWrap.style.zIndex = `${nodeElements.length}`;
      }
    }

    dispatch(setSelected(id));
  };

  const handleChatbubbleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect() || new DOMRect();
    const cardType = e.dataTransfer.getData('cardType') as TNodeTypes;
    if (!cardType) {
      handleIsOpen(true);
      setPopUpPosition({
        x: Math.round(e.clientX / scale) - canvasRect.left,
        y: Math.round(e.clientY / scale) - canvasRect.top,
      });
      return;
    }
    const nodeName = e.dataTransfer.getData('nodeName') as string;

    const nodeView = nodeDefaultHelper.createDefaultView(cardType);

    const addNode: INode = {
      id: ID_GEN.generate('node'),
      type: cardType,
      x: Math.round(e.clientX / scale) - canvasRect.left,
      y: Math.round(e.clientY / scale) - canvasRect.top,
      title: nodeName,
      nodeKind: getNodeKind(cardType),
      view: nodeView,
      option: 1,
      seq: 0,
    };

    dispatch(appendNode(addNode));
  };

  const handleUpdateNodePosition = (index: number, item: INode) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const nodeRect = nodeRef.current[index]?.getBoundingClientRect();
    const x = Math.round((nodeRect?.x || 0) - (canvasRect?.left || 0));
    const y = Math.round((nodeRect?.y || 0) - (canvasRect?.top || 0));
    if (x === item.x && y === item.y) {
      return;
    }

    const distance = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));

    if (distance > NODE_DRAG_FACTOR) {
      const node = {
        ...item,
        x,
        y,
      };
      dispatch(updateNode(node));

      dirtySelect = node.id;
    } else {
      dispatch(setSelected(item.id));
    }
  };

  const [cutNode, setCutNode] = useState<INode>();

  const handlePasteCard = () => {
    if (clipBoard) {
      const clone = nodeHelper.cloneNode(clipBoard);
      dispatch(appendNode({ ...clone, x: points.x, y: points.y }));
    }
    console.log('------------');
    // console.log('cutnode in paste', cutNode);
    // if (cutNode) {
    //   console.log('handlePasteCard cutNode: ', cutNode);
    //   dispatch(appendNode(cutNode));
    // }
  };
  const handleDeleteCard = (node: INode) => {
    console.log('handle delete card');
    dispatch(removeItem(node.id));
  };

  const canvasContextMenu: IPopperItem<{ action: () => void }> = {
    id: 'paste',
    name: 'to paste',
    type: 'icon-front',
    icon: icCardPaste,
    data: {
      action: handlePasteCard,
    },
  };
  const { clicked, setClicked, points, setPoints } = useContextMenu();

  const handleContenxtMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log('on context click');
    setClicked(true);
    const canvasRect = canvasRef.current?.getBoundingClientRect() || new DOMRect();
    setPoints({
      x: Math.round(e.clientX / scale) - canvasRect.left,
      y: Math.round(e.clientY / scale) - canvasRect.top,
    });
  };
  return (
    <>
      <div
        className="botBuilderMain"
        onWheel={outterMouseWheelHandler}
        onMouseDown={handleCanvasClick}
        onMouseMoveCapture={outterMouseMoveHandler}
        //onMouseUpCapture={handleCanvasClick}
        ref={botbuilderRef}
        role="presentation"
        onDrop={handleChatbubbleDrop}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        <BotBuilderZoomBtn />

        <div
          className="canvasWrapper"
          style={{ left: 0, top: 0, zoom: `${scale * 100}%` }}
          ref={canvasRef}
          role="presentation"
          onContextMenu={(e) => {
            e.preventDefault();
            handleContenxtMenu(e);
          }}
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
              enableUserSelectHack={true}
              onDrag={(e) => {
                e.stopPropagation();
                if (e.isTrusted) {
                  updateLine(`${NODE_PREFIX}${item.id}`);
                }
              }}
              onStop={(e) => {
                console.log('onStop');
                handleUpdateNodePosition(i, item);
                e.stopPropagation();
              }}
              cancel=".node-draggable-ignore"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div
                key={item.id}
                role="presentation"
                className="draggableNode"
                style={{
                  position: 'absolute',
                  zIndex: 1,
                }}
                ref={(el) => (nodeRef.current[i] = el)}
                // onContextMenu={(e) => e.preventDefault()}
              >
                <Node
                  typeName={item.type}
                  nodekind={item.nodeKind}
                  id={item.id}
                  key={item.id}
                  title={item.title}
                  node={item}
                  active={selected === item.id}
                  onClick={() => handleNodeClick(item.id)}
                  addArrow={(arrow: IArrow) => {
                    handleAddArrows(arrow);
                  }}
                />
              </div>
            </Draggable>
          ))}
          <LineContainer />
          {isOpen && (
            <NodeLinkPopUpMenu
              handleIsOpen={handleIsOpen}
              popUpPosition={popUpPosition}
            />
          )}
          {clicked && (
            <div
              className="luna-popup-container luna-chatbot-container"
              style={{
                top: points.y,
                left: points.x,
                position: 'absolute',
                backgroundColor: '#ffffff',
              }}
            >
              <div
                className="luna-chatbot-list luna-popup-list"
                role="presentation"
                onClick={handlePasteCard}
              >
                <img src={canvasContextMenu.icon} alt="icon" />
                <p className="items-name">{canvasContextMenu.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <NodeEditDrawer />
    </>
  );
};
