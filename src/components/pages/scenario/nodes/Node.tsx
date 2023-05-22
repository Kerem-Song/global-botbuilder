import { icNodeBottom } from '@assets';
import { Button, Popper } from '@components';
import { CarouselOrderPopup } from '@components/pages/scenario/edit/CarousleOrderPopup';
import { UtteranceDetailPopup } from '@components/pages/utterance/UtteranceDetailPopup';
import { UtterancePopup } from '@components/pages/utterance/UtterancePopup';
import {
  useHistoryViewerMatch,
  useModalOpen,
  useModalOpenExtra,
  useNodeContextMenu,
  usePage,
  useRootState,
  useScenarioClient,
  useUpdateLines,
} from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IArrow, INode, ISearchData } from '@models';
import { NodeKind } from '@models/enum/NodeKind';
import { IHasChildrenView } from '@models/interfaces/res/IGetFlowRes';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';
import {
  setClipBoard,
  setEditDrawerToggle,
  setGuideStartNode,
} from '@store/botbuilderSlice';
import { appendNode } from '@store/makingNode';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { NODE_TYPES, TNodeTypes } from '../../../../models/interfaces/ICard';
import { IHasChildren } from '../../../../models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from '../../../../models/interfaces/IHasStyle';
import { SizeType } from '../../../../models/types/SizeType';
import { NODE_PREFIX, nodeHelper } from '../../../../modules';
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

  const { tc } = usePage();
  const dispatch = useDispatch();

  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const invalidate = useRootState(
    (state) => state.botBuilderReducer.invalidateNodes[node.id],
  );
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const clipBoard = useRootState((state) => state.botBuilderReducer.clipBoard);
  const { updateLine } = useUpdateLines();
  const wrapClass = classNames(className, 'luna-node', {
    'luna-node-bordered': bordered,
    'luna-node-hoverble': hoverable,
    [`border-radious-${radius}`]: radius !== 'none',
    'luna-node-active': active,
    'luna-node-invalidate': invalidate,
  });

  const titleClass = classNames('luna-node-head');
  const bodyClass = classNames('luna-node-body');
  const isHistoryViewer = useHistoryViewerMatch();

  const { isOpen: isOpenUtterancePopup, handleIsOpen: handleIsOpenUtterancePopup } =
    useModalOpen();

  const { handleDuplicationCard, handleCutCard, deleteCard, getNodeMenu } =
    useNodeContextMenu({ handleIsOpen, handleIsOpenUtterancePopup });

  const handleChangeCarouselOrder = () => {
    dispatch(setEditDrawerToggle(false));
    handleIsOpen(true);
  };

  const handleBottomDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.isTrusted) {
      const guide = document.querySelector<HTMLDivElement>('#icGuide');

      if (guide) {
        const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');
        const cr = canvas?.getBoundingClientRect() || new DOMRect();
        const newPosition = {
          x: e.clientX / scale - cr.x - 11,
          y: e.clientY / scale - cr.y - 12,
        };
        guide.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
      }
      updateLine(`${NODE_PREFIX}${id}`);
    }
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

  const handlePasteCard = () => {
    const view = document.querySelector('.botBuilderMain');
    const canvas = document.querySelector('.canvasWrapper');
    const canvasRect = canvas?.getBoundingClientRect();
    const viewRect = view?.getBoundingClientRect();

    if (clipBoard) {
      const clone = nodeHelper.cloneNode(clipBoard);

      const filtered = nodes.filter((node) => {
        return node.title?.includes(clone.title!);
      });

      let index = 1;

      if (filtered) {
        const regex = /[^0-9]/g;
        const results =
          filtered?.map((x) => {
            return Number(x.title?.replace(clone.title!, '').replace(regex, ''));
          }) || [];

        for (const i of results) {
          if (!results.includes(i + 1)) {
            index = Number(i + 1);
            break;
          }
        }
      }

      dispatch(
        appendNode({
          ...clone,
          x:
            canvasRect && viewRect
              ? Math.round(viewRect.width / 2 - 108 + (viewRect.x - canvasRect.x))
              : 0,
          y:
            canvasRect && viewRect
              ? Math.round(viewRect.height / 2 - 130 + (viewRect.y - canvasRect.y))
              : 0,
          title: clone.title + `_(${index})`,
        }),
      );
      dispatch(setClipBoard(undefined));
    }
  };

  const keyEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Delete') {
      deleteCard(node);
    } else if (e.code === 'KeyC' && e.ctrlKey) {
      handleDuplicationCard(node);
    } else if (e.code === 'KeyX' && e.ctrlKey) {
      handleCutCard(node);
      dispatch(setEditDrawerToggle(false));
    }
  };

  const handleCtrlVCommand = (e: KeyboardEvent) => {
    if (e.code === 'KeyV' && e.ctrlKey) {
      handlePasteCard();
    }
  };

  useEffect(() => {
    if (clipBoard) {
      window.addEventListener('keydown', handleCtrlVCommand);
    }
    return () => {
      window.removeEventListener('keydown', handleCtrlVCommand);
    };
  }, [clipBoard]);

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
        disabled={isHistoryViewer}
      >
        <div
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
            {title ? <p>{title}</p> : undefined}
            {popperMenu.length === 0 ? (
              <></>
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
                disabled={isHistoryViewer}
              >
                <Button shape="ghost" small>
                  <i className="fa-solid fa-ellipsis-vertical" />
                </Button>
              </Popper>
            )}
          </div>
          <div className={bodyClass}>{handleShowingNodesWithoutCards()}</div>
          {nodekind === NodeKind.InputNode && (
            <Button shape="ghost" className="icNodeBottom">
              <div
                id={`${NODE_PREFIX}bottom-${id}`}
                role="presentation"
                className="node-draggable-ignore"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('id', `${NODE_PREFIX}${id}`);
                  e.dataTransfer.setData('pointType', 'blue');
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
            </Button>
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
