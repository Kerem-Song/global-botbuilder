import { icNodeBottom } from '@assets';
import { Button, Popper } from '@components';
import { CarouselOrderPopup } from '@components/pages/scenario/edit/CarousleOrderPopup';
import {
  useModalOpen,
  useNodeContextMenu,
  usePage,
  useRootState,
  useUpdateLines,
} from '@hooks';
import { usePanning } from '@hooks/usePanning';
import { IArrow, INode, NodeOption } from '@models';
import { NodeKind } from '@models/enum/NodeKind';
import { IHasChildrenView } from '@models/interfaces/res/IGetFlowRes';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';
import { setEditDrawerToggle, setGuideStartNode } from '@store/botbuilderSlice';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import MultiClamp from 'react-multi-clamp';
import { useDispatch } from 'react-redux';

import { NODE_TYPES, TNodeTypes } from '../../../../models/interfaces/ICard';
import { IHasChildren } from '../../../../models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from '../../../../models/interfaces/IHasStyle';
import { SizeType } from '../../../../models/types/SizeType';
import { NODE_PREFIX } from '../../../../modules';
import { IntentUtterancePopup } from '../IntentUtterancePopup';
export interface INodeProps extends IHasChildren, IHasClassNameNStyle {
  id?: string;
  typeName: TNodeTypes;
  nodekind: NodeKind;
  title?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  active?: boolean;
  radius?: SizeType;
  node: INode;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  addArrow?: (arrow: IArrow) => void;
  ref?: React.RefObject<HTMLDivElement | null>[];
}

export const Node: FC<INodeProps> = ({
  id,
  typeName,
  nodekind,
  node,
  className,
  style,
  title,
  bordered = true,
  hoverable,
  active,
  radius = 'small',
  onClick,
  addArrow,
}) => {
  const { isOpen, handleIsOpen } = useModalOpen();

  const { isReadOnly } = usePage();
  const dispatch = useDispatch();
  const arrows = useRootState((state) => state.makingNodeSliceReducer.present.arrows);
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const invalidate = useRootState(
    (state) => state.botBuilderReducer.invalidateNodes[node.id],
  );
  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const clipBoard = useRootState((state) => state.botBuilderReducer.clipBoard);
  const guideInfo = useRootState((state) => state.botBuilderReducer.guideInfo);

  const { updateLine } = useUpdateLines();

  const { dragPanning } = usePanning();

  const wrapClass = classNames(className, 'luna-node', {
    'luna-node-bordered': bordered,
    'luna-node-hoverble': hoverable,
    [`border-radious-${radius}`]: radius !== 'none',
    'luna-node-active': active,
    'luna-node-invalidate': invalidate,
  });

  const titleClass = classNames('luna-node-head');
  const bodyClass = classNames('luna-node-body');

  const { isOpen: isOpenUtterancePopup, handleIsOpen: handleIsOpenUtterancePopup } =
    useModalOpen();

  const {
    handleDuplicationCard,
    handleCutCard,
    handlePasteCard,
    deleteCard,
    getNodeMenu,
  } = useNodeContextMenu({ handleIsOpen, handleIsOpenUtterancePopup });

  const handleChangeCarouselOrder = () => {
    dispatch(setEditDrawerToggle(false));
    handleIsOpen(true);
  };

  const handleBottomDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const guide = document.querySelector<HTMLDivElement>('#icGuide');
    if (guide) {
      if (e.isTrusted) {
        const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');
        const cr = canvas?.getBoundingClientRect() || new DOMRect();
        const newPosition = {
          x: e.clientX / scale - cr.x - 11,
          y: e.clientY / scale - cr.y - 12,
        };
        guide.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
      }
      if (guideInfo) {
        updateLine(guideInfo.nodeId || guideInfo.startId);
      }
      //updateLine(`${NODE_PREFIX}${id}`);
    }
    dragPanning(e);
  };

  const popperMenu = getNodeMenu(typeName);

  const handleShowingNodesWithoutCards = () => {
    const NodeElement = nodeFactory.getFactory(typeName)?.getNodeElement();

    if (!NodeElement) {
      return <></>;
    }

    return <NodeElement node={node} />;
  };

  const HandleNodeSelect = async (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
  };

  const keyEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Delete' && !isReadOnly) {
      deleteCard(node);
    } else if (e.code === 'KeyC' && e.ctrlKey && !isReadOnly) {
      handleDuplicationCard(node);
    } else if (e.code === 'KeyX' && e.ctrlKey && !isReadOnly) {
      handleCutCard(node);
      dispatch(setEditDrawerToggle(false));
    }
  };

  const handleCtrlVCommand = (e: KeyboardEvent) => {
    const view = document.querySelector('.botBuilderMain');
    const canvas = document.querySelector('.canvasWrapper');
    const canvasRect = canvas?.getBoundingClientRect();
    const viewRect = view?.getBoundingClientRect();

    if (e.code === 'KeyV' && e.ctrlKey && !isReadOnly) {
      handlePasteCard({
        x:
          canvasRect && viewRect
            ? Math.round(viewRect.width / 2 - 108 + (viewRect.x - canvasRect.x))
            : 0,
        y:
          canvasRect && viewRect
            ? Math.round(viewRect.height / 2 - 130 + (viewRect.y - canvasRect.y))
            : 0,
      });
    }
  };

  const handleZIndex = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedNode = document.getElementById(`${NODE_PREFIX}${id}`);

    if (selectedNode?.parentElement?.parentElement?.parentElement) {
      selectedNode.parentElement.parentElement.parentElement.style.zIndex = '3';
    }
    const x = e.clientX;
    const y = e.clientY;
    setPopperPositions({ x, y });
  };

  useEffect(() => {
    if (clipBoard) {
      window.addEventListener('keydown', handleCtrlVCommand);
    }
    return () => {
      window.removeEventListener('keydown', handleCtrlVCommand);
    };
  }, [clipBoard]);

  const nodeIcon = nodeFactory.getFactory(node.type)?.getNodeImgIconUrl();

  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [popperPositions, setPopperPositions] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const handlePopperPosition = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      console.log('@event', e.clientX, e.clientY);

      const x = e.clientX;
      const y = e.clientY;
      setPopperPositions({ x, y });
    },
    [popperPositions],
  );

  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.addEventListener('contextmenu', (e: any) =>
        handlePopperPosition(e),
      );
    }
    return () => {
      if (nodeRef.current) {
        nodeRef.current?.removeEventListener('contextmenu', (e: any) => {
          handlePopperPosition(e);
          setPopperPositions({ x: 0, y: 0 });
        });
      }
    };
  }, [scale]);

  return (
    <>
      <Popper
        className="onContextMenu"
        placement="right"
        offset={[0, -100]}
        popup
        popupList
        popperItems={popperMenu}
        onChange={(m) => {
          m.data?.action?.(node);
        }}
        disabled={isReadOnly || node.option === NodeOption.Fallback}
        positions={{ x: popperPositions.x, y: popperPositions.y }}
      >
        <div
          ref={nodeRef}
          tabIndex={0}
          onKeyDown={keyEvent}
          onDragStart={(e) => {
            const from = e.dataTransfer.getData('id');
            if (from) {
              return;
            }
            e.stopPropagation();
            e.preventDefault();
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const from = e.dataTransfer.getData('id');
            if (!from || id === from) {
              return;
            }

            dispatch(setGuideStartNode());
            const nodeId = e.dataTransfer.getData('nodeId');
            const isNext = e.dataTransfer.getData('isNext');
            const pointType = e.dataTransfer.getData('pointType');

            addArrow?.({
              start: from,
              end: `${NODE_PREFIX}${id}`,
              updateKey: nodeId,
              isNextNode: isNext === '1',
              type: pointType as 'blue',
            });
          }}
          id={`${NODE_PREFIX}${id}`}
          className={wrapClass}
          style={style}
          role="button"
          onClick={HandleNodeSelect}
          //onMouseUp={(e) => e.stopPropagation()}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          <div className={titleClass}>
            {/* {nodeIcon && <img src={nodeIcon} alt="nodeIcon" className="nodeIcon" />} */}
            <span className="nodeIcon" data-icon={nodeIcon}></span>
            {title ? (
              <div className="nodeHeadTitle">
                <MultiClamp clamp={2} ellipsis={'...'}>
                  {node.option === NodeOption.First ? selectedScenario?.alias : title}
                </MultiClamp>
              </div>
            ) : undefined}
            {popperMenu.length === 0 || node.option === NodeOption.Fallback ? (
              <div></div>
            ) : (
              <Popper
                placement="right-start"
                // offset={[-10, 15]}
                popup
                popupList
                popperItems={popperMenu}
                onChange={(m) => {
                  m.data?.action?.(node);
                }}
                disabled={isReadOnly}
                className="contextMenuBtn"
                positions={{ x: popperPositions.x, y: popperPositions.y }}
              >
                <Button shape="ghost" small onClick={(e) => handleZIndex(e)}>
                  <i className="fa-solid fa-ellipsis-vertical" />
                </Button>
              </Popper>
            )}
          </div>
          <div className={bodyClass}>{handleShowingNodesWithoutCards()}</div>
          {nodekind === NodeKind.InputNode && (
            <>
              <div className="icNodeBottom">
                <div
                  id={`${NODE_PREFIX}bottom-${id}`}
                  role="presentation"
                  className="node-draggable-ignore"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('id', `${NODE_PREFIX}${id}`);
                    e.dataTransfer.setData('pointType', 'blue');
                    e.dataTransfer.setData('isDraggedNodeBottom', 'true');
                    dispatch(
                      setGuideStartNode({
                        startId: `${NODE_PREFIX}${id}`,
                        isNext: false,
                        type: 'blue',
                      }),
                    );
                  }}
                  onDragEnd={() => {
                    dispatch(setGuideStartNode());
                  }}
                  onDrag={handleBottomDrag}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <img src={icNodeBottom} alt="icNodeBottom" />
                </div>
              </div>
            </>
          )}
        </div>
      </Popper>
      {node.view &&
        (node.type === NODE_TYPES.BASIC_CARD_CAROUSEL_NODE ||
          node.type === NODE_TYPES.LIST_CARD_CAROUSEL_NODE ||
          node.type === NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE) && (
          <CarouselOrderPopup
            isOpen={isOpen}
            handleIsOpen={handleIsOpen}
            handleSave={handleChangeCarouselOrder}
            nodeView={node.view as IHasChildrenView}
            nodeId={`${NODE_PREFIX}${id}`}
            node={node}
          />
        )}
      {typeName === 'IntentNode' && (
        <IntentUtterancePopup
          handleIsOpenUtterancePopup={handleIsOpenUtterancePopup}
          isOpenUtterancePopup={isOpenUtterancePopup}
        />
      )}
    </>
  );
};
