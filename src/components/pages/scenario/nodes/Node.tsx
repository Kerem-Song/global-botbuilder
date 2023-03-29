import {
  icCardCut,
  icCardDelete,
  icCardDuplication,
  icCardPaste,
  icEditCarousel,
  icNodeBottom,
} from '@assets';
import { Button, IPopperItem, Popper } from '@components';
import { HistoryViewerMatch } from '@components/pages/history/HistoryViewerMatch';
import { CarouselOrderPopup } from '@components/pages/scenario/edit/CarousleOrderPopup';
import { AnswerNode } from '@components/pages/scenario/nodes/AnswerNode';
import { BasicCardCarouselNode } from '@components/pages/scenario/nodes/BasicCardCarouselNode';
import { BasicCardNode } from '@components/pages/scenario/nodes/BasicCardNode';
import { CommerceCardCarouselNode } from '@components/pages/scenario/nodes/CommerceCardCarouselNode';
import { CommerceCardNode } from '@components/pages/scenario/nodes/CommerceCardNode';
import { ConditionNode } from '@components/pages/scenario/nodes/ConditionNode';
import { IntentNode } from '@components/pages/scenario/nodes/IntentNode';
import { ListCardCarouselNode } from '@components/pages/scenario/nodes/ListCardCarouselNode';
import { ListCardNode } from '@components/pages/scenario/nodes/ListCardNode';
import { OtherFlowRedirectNode } from '@components/pages/scenario/nodes/OtherFlowRedirectNode';
import { ParameterSetNode } from '@components/pages/scenario/nodes/ParameterSetNode';
import { RetryConditionNode } from '@components/pages/scenario/nodes/RetryConditionNode';
import { TextNode } from '@components/pages/scenario/nodes/TextNode';
import { useModalOpen, usePage, useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IArrow, INode } from '@models';
import { NodeKind } from '@models/enum/NodeKind';
import { IHasChildrenView } from '@models/interfaces/res/IGetFlowRes';
import { lunaToast } from '@modules/lunaToast';
import { setClipBoard, setGuideStartNode, setSelected } from '@store/botbuilderSlice';
import { appendNode, removeItem } from '@store/makingNode';
import classNames from 'classnames';
import { FC, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMatch } from 'react-router';

import { NODE_TYPES } from '../../../../models/interfaces/ICard';
import { IHasChildren } from '../../../../models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from '../../../../models/interfaces/IHasStyle';
import { SizeType } from '../../../../models/types/SizeType';
import { NODE_PREFIX, nodeHelper } from '../../../../modules';
import { NextNodeButton } from '../NextNodeButton';

export interface INodeProps extends IHasChildren, IHasClassNameNStyle {
  id?: string;
  typeName: string;
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
  const { tc } = usePage();
  const { isOpen, handleIsOpen } = useModalOpen();
  const dispatch = useDispatch();
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const invalidate = useRootState(
    (state) => state.botBuilderReducer.invalidateNodes[node.id],
  );
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

  const handleDuplicationCard = (node: INode) => {
    dispatch(setClipBoard(node));
  };

  const handleCutCard = (node: INode) => {
    if (node.type === NODE_TYPES.INTENT_NODE) {
      return;
    }
    dispatch(setClipBoard(node));
    dispatch(removeItem(node.id));
  };

  const handlePasteCard = (node: INode) => {
    console.log('handle Paste');
  };

  const handleDeleteCard = (node: INode) => {
    deleteCard(node.id);
  };

  const deleteCard = (nodeId: string) => {
    if (node.type === NODE_TYPES.INTENT_NODE) {
      return;
    }
    dispatch(removeItem(nodeId));
    dispatch(setSelected());
    lunaToast.success(tc('DELETE_MESSAGE'));
  };

  const handleChangeCarouselOrder = () => {
    console.log('handle change carousel order');
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

  const nodeMenu: IPopperItem<{ action: (node: INode) => void }>[] = [
    {
      id: 'duplication',
      name: 'Duplication',
      type: 'icon-front',
      icon: icCardDuplication,
      data: {
        action: handleDuplicationCard,
      },
    },
    {
      id: 'cut',
      name: 'Cut',
      type: 'icon-front',
      icon: icCardCut,
      data: {
        action: handleCutCard,
      },
    },
    {
      id: 'delete',
      name: 'Delete',
      type: 'icon-front',
      icon: icCardDelete,
      data: {
        action: handleDeleteCard,
      },
    },
    {
      id: 'carousel',
      name: 'Carousel',
      type: 'icon-front',
      icon: icEditCarousel,
      data: {
        action: handleChangeCarouselOrder,
      },
    },
  ];

  const popperMenu = () => {
    console.log('typename', typeName);
    switch (typeName) {
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
      case NODE_TYPES.LIST_CARD_CAROUSEL_NODE:
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
        return nodeMenu;
      case NODE_TYPES.INTENT_NODE:
        return [];
      default:
        return nodeMenu.slice(0, 3);
    }
  };

  const handleShowingNodesWithoutCards = () => {
    // console.log(node);
    switch (typeName) {
      case NODE_TYPES.INTENT_NODE:
        return <IntentNode id={id} />;
      case NODE_TYPES.CONDITION_NODE:
        return <ConditionNode node={node} />;
      case NODE_TYPES.RETRY_CONDITION_NODE:
        return <RetryConditionNode node={node} />;
      case NODE_TYPES.PARAMETER_SET_NODE:
        return <ParameterSetNode node={node} />;
      case NODE_TYPES.JSON_REQUEST_NODE:
        return (
          <div className="command-node">
            <NextNodeButton ctrlId={`${id}`} nodeId={`${NODE_PREFIX}${id}`} type="blue" />
          </div>
        );
      case NODE_TYPES.OTHER_FLOW_REDIRECT_NODE:
        return <OtherFlowRedirectNode />;
      case NODE_TYPES.ANSWER_NODE:
        return <AnswerNode nodeId={`${id}`} node={node} />;
      case NODE_TYPES.TEXT_NODE:
        return <TextNode node={node} />;
      case NODE_TYPES.BASIC_CARD_NODE:
        return <BasicCardNode node={node} />;
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
        return <BasicCardCarouselNode node={node} />;
      case NODE_TYPES.LIST_CARD_NODE:
        return <ListCardNode node={node} />;
      case NODE_TYPES.LIST_CARD_CAROUSEL_NODE:
        return <ListCardCarouselNode node={node} />;
      case NODE_TYPES.PRODUCT_CARD_NODE:
        return <CommerceCardNode node={node} />;
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
        return <CommerceCardCarouselNode node={node} />;
    }
  };

  const HandleNodeSelect = async (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
  };

  const keyEvent = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Delete') {
      deleteCard(node.id);
    } else if (e.key === 'c' && e.ctrlKey) {
      console.log(e);
    }
  };

  return (
    <>
      <Popper
        className="onContextMenu"
        placement="right"
        offset={[0, -100]}
        popup
        popupList
        popperItems={popperMenu()}
        onChange={(m) => {
          m.data?.action?.(node);
        }}
        disabled={HistoryViewerMatch()}
      >
        <div
          tabIndex={0}
          onKeyDown={keyEvent}
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
          onMouseUp={(e) => e.stopPropagation()}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          <div className={titleClass}>
            {title ? <p>{title}</p> : undefined}
            <Popper
              placement="right-start"
              // offset={[-10, 15]}
              popup
              popupList
              popperItems={popperMenu()}
              onChange={(m) => {
                m.data?.action?.(node);
              }}
              disabled={HistoryViewerMatch()}
            >
              <Button shape="ghost" small>
                <i className="fa-solid fa-ellipsis-vertical" />
              </Button>
            </Popper>
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
      {node.view && (
        <CarouselOrderPopup
          isOpen={isOpen}
          handleIsOpen={handleIsOpen}
          handleSave={handleChangeCarouselOrder}
          nodeView={node.view as IHasChildrenView}
          nodeId={`${NODE_PREFIX}${id}`}
          node={node}
        />
      )}
    </>
  );
};
