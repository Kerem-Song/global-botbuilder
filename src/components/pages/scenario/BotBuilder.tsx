import { Node } from '@components/data-display';
import { defaultNode } from '@components/data-display/DefaultCards';
import { useModalOpen, useRootState, useScenarioClient } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { getNodeKind, IArrow, INode, TNodeTypes } from '@models';
import {
  setEditDrawerToggle,
  setSelected,
  zoomIn,
  zoomOut,
} from '@store/botbuilderSlice';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';

import { ID_GEN, NODE_PREFIX } from '../../../modules';
import { nodeHelper } from '../../../modules/nodeHelper';
import { addArrow, appendNode, updateNode } from '../../../store/makingNode';
import { BotBuilderZoomBtn } from './BotBuilderZoomBtn';
import { NodeEditDrawer } from './edit/NodeEditDrawer';
import { LineContainer } from './LineContainer';
import { NodeLinkPopUpMenu } from './NodeLinkPopUpMenu';

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
  const token = useRootState((state) => state.botBuilderReducer.token);

  const { getScenario } = useScenarioClient();
  getScenario(token, selectedScenario?.id);

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

    const nodeView = nodeHelper.createDefaultView(cardType);

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
    const node = {
      ...item,
      x,
      y,
    };
    dispatch(updateNode(node));

    dirtySelect = node.id;
  };

  return (
    <>
      <BotBuilderZoomBtn />

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
        </div>
      </div>

      <NodeEditDrawer />
    </>
  );
};
