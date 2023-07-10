import {
  icCardCutDisabled,
  icCardDeleteDisabled,
  icCardDuplicationDisabled,
  icCardPaste,
  icCardPasteDisabled,
} from '@assets';
import { IPopperItem } from '@components/navigation';
import {
  useModalOpen,
  useNodeContextMenu,
  usePage,
  useRootState,
  useScenarioClient,
} from '@hooks';
import { useAddArrow } from '@hooks/useAddArrow';
import { useContextMenu } from '@hooks/useContextMenu';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IArrow, INode, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';
import { ID_GEN, NODE_DRAG_FACTOR, NODE_PREFIX } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setSelected, zoomIn, zoomOut } from '@store/botbuilderSlice';
import { appendNode, updateNode } from '@store/makingNode';
import {
  otherFlowScenariosPopupStatus,
  setOtherFlowPopupPosition,
} from '@store/otherFlowScenarioPopupSlice';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { BotBuilderZoomBtn } from './BotBuilderZoomBtn';
import { LineContainer } from './LineContainer';
import { NodeLinkPopUpMenu } from './NodeLinkPopUpMenu';
import { Node } from './nodes';
import { OtherFlowScenariosPopup } from './OtherFlowScenariosPopup';
let dirtySelect: string | undefined;

export const Botbuilder = () => {
  const dispatch = useDispatch();
  const { updateLine } = useUpdateLines();

  const { t } = usePage();

  const botbuilderRef = useRef<HTMLDivElement | null>(null);
  const canvasRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const nodeRef: React.MutableRefObject<(HTMLDivElement | null)[]> = useRef([]);

  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [popUpPosition, setPopUpPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDraggedNodeBottom, setIsDraggedNodeBottom] = useState<boolean>(false);
  const [tempNodeNames, setTempNodeNames] = useState<number[]>([]);

  const otherFlowPopupIsOpen = useRootState(
    (state) => state.otherFlowScenariosPopupStatusReducer.isOpen,
  );

  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);

  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );

  const clipBoard = useRootState((state) => state.botBuilderReducer.clipBoard);
  const { addArrowHandler } = useAddArrow();
  const isHistoryViewer = useHistoryViewerMatch();

  const { getScenario } = useScenarioClient();
  getScenario(selectedScenario?.id);
  // if (!isHistoryViewer) {

  // }

  const { isOpen, handleIsOpen } = useModalOpen();

  const { updateLineAll } = useUpdateLines();

  const { handlePasteCard } = useNodeContextMenu({
    handleIsOpen: () => null,
    handleIsOpenUtterancePopup: () => null,
  });

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      if (e.deltaY > 0) {
        handleZoomOut();
      } else {
        handleZoomIn();
      }
      e.preventDefault();
    }
  };

  useEffect(() => {
    const event = () => {
      setIsPanning(false);
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mouseup', event);
    return () => {
      window.removeEventListener('mouseup', event);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleAddArrows = (arrow: IArrow) => {
    addArrowHandler(nodes, arrow);
  };

  const handleZoomOut = useCallback(() => {
    dispatch(zoomOut());
  }, []);

  const handleZoomIn = useCallback(() => {
    dispatch(zoomIn());
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.left = '0px';
      canvasRef.current.style.top = '0px';
    }
  }, [selectedScenario]);

  const factor = { x: 0, y: 0 };
  const panning = (x: number, y: number) => {
    if (
      !canvasRef.current ||
      parseInt(canvasRef.current.style.left) + x / scale > 4000 ||
      parseInt(canvasRef.current.style.top) + y / scale > 4000
    ) {
      return;
    }
    // console.log(
    //   '@pixel',
    //   `${parseInt(canvasRef.current.style.left) + x / scale}px`,
    //   `${parseInt(canvasRef.current.style.top) + y / scale}px`,
    // );
    factor.x += x / scale;
    factor.y += y / scale;

    const distance = Math.sqrt(Math.pow(factor.x, 2) + Math.pow(factor.y, 2));

    if (distance > 20) {
      canvasRef.current.style.left = `${
        parseInt(canvasRef.current.style.left) + factor.x
      }px`;

      factor.x = 0;

      canvasRef.current.style.top = `${
        parseInt(canvasRef.current.style.top) + factor.y
      }px`;

      factor.y = 0;
    }
  };

  const outterMouseMoveHandler = (e: React.MouseEvent): void => {
    e.stopPropagation();
    isPanning && panning(e.movementX, e.movementY);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    //e.preventDefault();

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

    dispatch(setSelected(id));
  };

  const handleChatbubbleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect() || new DOMRect();
    const cardType = e.dataTransfer.getData('cardType') as TNodeTypes;
    const isNodeBottom = e.dataTransfer.getData('isDraggedNodeBottom');

    if (!cardType) {
      isNodeBottom === 'true' && setIsDraggedNodeBottom(true);
      handleIsOpen(true);
      setPopUpPosition({
        x: Math.round(e.clientX / scale) - canvasRect.left / scale,
        y: Math.round(e.clientY / scale) - canvasRect.top / scale,
      });
      return;
    }

    if (cardType === NODE_TYPES.OTHER_FLOW_REDIRECT_NODE) {
      setIsDraggedNodeBottom(false);
      dispatch(
        setOtherFlowPopupPosition({
          x: Math.round(e.clientX / scale) - canvasRect.left / scale,
          y: Math.round(e.clientY / scale) - canvasRect.top / scale,
        }),
      );
      dispatch(otherFlowScenariosPopupStatus(true));

      return;
    }
    setIsDraggedNodeBottom(false);
    const nodeName = e.dataTransfer.getData('nodeName') as string;
    const nodeView = nodeDefaultHelper.createDefaultView(cardType);

    const basicNameNodesRegex = new RegExp(`${nodeName}`);
    const filtered = nodes.filter((node) => basicNameNodesRegex.test(node.title!));
    let index = 1;

    if (filtered || tempNodeNames) {
      const regex = /[^0-9]/g;
      const results = filtered?.map((x) => Number(x.title?.replace(regex, ''))) || [];
      const max = Math.max(...results, ...tempNodeNames);

      for (let i = 1; i <= max + 1; i++) {
        if (!results.includes(i)) {
          index = i;
          break;
        }
      }
    }

    setTempNodeNames([...tempNodeNames, index]);

    const addNode: INode = {
      id: ID_GEN.generate('node'),
      type: cardType,
      x: Math.round(e.clientX / scale) - canvasRect.left / scale,
      y: Math.round(e.clientY / scale) - canvasRect.top / scale,
      title: `${nodeName} ` + `${index}`.padStart(2, '0'),
      nodeKind: nodeFactory.getFactory(cardType)?.nodeKind || NodeKind.Unkonown,
      view: nodeView,
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

  const { clicked, setClicked, points, setPoints } = useContextMenu();

  const canvasContextMenu: IPopperItem<{ action: () => void }>[] = [
    {
      id: 'duplication',
      name: t('DUPLICATION'),
      type: 'icon-front',
      icon: icCardDuplicationDisabled,
      data: {
        action: () => null,
      },
    },
    {
      id: 'cut',
      name: t('CUT'),
      type: 'icon-front',
      icon: icCardCutDisabled,
      data: {
        action: () => null,
      },
    },
    {
      id: 'paste',
      name: t('TO_PASTE'),
      type: 'icon-front',
      icon: clipBoard ? icCardPaste : icCardPasteDisabled,
      data: {
        action: clipBoard
          ? () => handlePasteCard({ x: points.x, y: points.y })
          : () => null,
      },
    },
    {
      id: 'delete',
      name: t('DELETE'),
      type: 'icon-front',
      icon: icCardDeleteDisabled,
      data: {
        action: () => null,
      },
    },
  ];

  const handleContenxtMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setClicked(true);
    const canvasRect = canvasRef.current?.getBoundingClientRect() || new DOMRect();

    setPoints({
      x: Math.round(e.clientX / scale) - canvasRect.left / scale,
      y: Math.round(e.clientY / scale) - canvasRect.top / scale,
    });
  };

  const handleUndoRedoKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.shiftKey && e.code === 'KeyZ' && e.ctrlKey && !isHistoryViewer) {
      updateLineAll();
      dispatch(ActionCreators.redo());
    } else if (!e.shiftKey && e.code === 'KeyZ' && e.ctrlKey && !isHistoryViewer) {
      updateLineAll();
      dispatch(ActionCreators.undo());
    }
  };

  useEffect(() => {
    setTempNodeNames([]);
  }, [nodes]);

  return (
    <>
      <div
        tabIndex={0}
        className="botBuilderMain"
        //onWheel={outterMouseWheelHandler}
        onMouseDown={handleCanvasClick}
        onMouseMoveCapture={outterMouseMoveHandler}
        //onMouseUpCapture={handleCanvasClick}
        ref={botbuilderRef}
        role="tab"
        onDragStart={(e) => {
          const from = e.dataTransfer.getData('id');
          if (from) {
            return;
          }
          e.stopPropagation();
          e.preventDefault();
        }}
        onDrop={handleChatbubbleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          handleIsOpen(false);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          handleContenxtMenu(e);
        }}
        onKeyDown={handleUndoRedoKeydown}
      >
        <BotBuilderZoomBtn />

        <div
          className="canvasWrapper"
          style={{ left: 4000, top: 4000, transform: `scale(${scale})` }}
          ref={canvasRef}
          role="presentation"
          onContextMenu={(e) => {
            e.preventDefault();
            // handleContenxtMenu(e);
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
                  zIndex: selected === item.id ? 4 : 2,
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
          {isHistoryViewer
            ? null
            : isOpen && (
                <NodeLinkPopUpMenu
                  handleIsOpen={handleIsOpen}
                  popUpPosition={popUpPosition}
                  isDraggedNodeBottom={isDraggedNodeBottom}
                />
              )}
          {otherFlowPopupIsOpen && <OtherFlowScenariosPopup />}
          {isHistoryViewer
            ? null
            : clicked && (
                <div
                  className="luna-popup-container luna-chatbot-container"
                  style={{
                    top: points.y,
                    left: points.x,
                    position: 'absolute',
                    backgroundColor: '#ffffff',
                    transform: `scale(${1 / scale})`,
                  }}
                >
                  {canvasContextMenu.map((item, i) => (
                    <div
                      key={i}
                      className="luna-chatbot-list luna-popup-list"
                      role="presentation"
                      onClick={item.data?.action}
                    >
                      <img src={item.icon} alt="icon" />
                      <p className="items-name">{item.name}</p>
                    </div>
                  ))}
                </div>
              )}
        </div>
      </div>
    </>
  );
};
