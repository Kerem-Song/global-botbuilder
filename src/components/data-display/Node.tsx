import { icCardDelete, icCardDuplication, icCardPaste, icNodeBottom } from '@assets';
import { Button, IPopperItem, Popper } from '@components';
import { useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { setGuideStartNode } from '@store/botbuilderSlice';
import { removeItem } from '@store/makingNode';
import classNames from 'classnames';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { IHasChildren } from 'src/models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from 'src/models/interfaces/IHasStyle';
import { SizeType } from 'src/models/types/SizeType';

import useI18n from '../../hooks/useI18n';
import {
  CARD_TYPES,
  IAnswerNode,
  IBasicCard,
  IBasicCardNode,
  ICommerceCard,
  ICondition,
  IConditionNode,
  ICount,
  ICountNode,
  IListCard,
  IListNode,
  IProductCardNode,
  IQuickReply,
  NODE_TYPES,
} from '../../models/interfaces/ICard';
import { BasicCard } from '../../pages/scenario/cards/BasicCard';
import { CommerceCard } from '../../pages/scenario/cards/CommerceCard';
import { Condition } from '../../pages/scenario/cards/Condition';
import { Count } from '../../pages/scenario/cards/Count';
import { ListCard } from '../../pages/scenario/cards/ListCard';
import { QuickReply } from '../../pages/scenario/cards/QuickReply';

export interface INodeProps extends IHasChildren, IHasClassNameNStyle {
  id?: string;
  typeName: string;
  title?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  active?: boolean;
  radius?: SizeType;
  cards?:
    | IBasicCardNode[]
    | IProductCardNode[]
    | IListNode[]
    | IAnswerNode[]
    | IConditionNode[]
    | ICountNode[];
  onClick?: (e?: any) => void;
  addArrow?: (from: string, to: string) => void;
  ref?: React.RefObject<HTMLDivElement | null>[];
}

export const Node: FC<INodeProps> = ({
  id,
  typeName,
  cards,
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
  const { tc } = useI18n();
  const dispatch = useDispatch();
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const { updateLine } = useUpdateLines();
  const wrapClass = classNames(className, 'luna-node', {
    'luna-node-bordered': bordered,
    'luna-node-hoverble': hoverable,
    [`border-radious-${radius}`]: radius !== 'none',
    'luna-node-active': active,
  });

  const titleClass = classNames('luna-node-head');
  const bodyClass = classNames('luna-node-body');

  const handleDuplicationCard = () => {
    console.log('handle duplication');
  };

  const handlePasteCard = () => {
    console.log('handle Paste');
  };

  const handleDeleteCard = () => {
    console.log('handle delete card');
    dispatch(removeItem(id));
  };

  const handleBottomDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.isTrusted) {
      const guide = document.querySelector<HTMLDivElement>('#icBottomGuide');
      if (guide) {
        const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');
        const cr = canvas?.getBoundingClientRect() || new DOMRect();
        const newPosition = {
          x: e.clientX / scale - cr.x - 11,
          y: e.clientY / scale - cr.y - 12,
        };
        guide.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
      }
      updateLine(`node-${id}`);
    }
  };

  const nodeMenu: IPopperItem<{ action: () => void }>[] = [
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
      id: 'paste',
      name: 'To Paste',
      type: 'icon-front',
      icon: icCardPaste,
      data: {
        action: handlePasteCard,
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
  ];

  // const handleShowingCards = (cards: INodeProps['cards']) => {
  //   if (!cards) {
  //     return <div></div>;
  //   }
  //   const cardType = cards[0].type;
  //   switch (cardType) {
  //     case CARD_TYPES.TEXT:
  //     case CARD_TYPES.IMAGE:
  //     case CARD_TYPES.BUTTON_TEMPLATE:
  //     case CARD_TYPES.BUTTON_CAROUSEL:
  //       return <BasicCard cards={cards as IBasicCard[]} nodeId={`node-${id}`} />;

  //     case CARD_TYPES.LIST:
  //     case CARD_TYPES.LIST_CAROUSEL:
  //       return <ListCard cards={cards as IListCard[]} nodeId={`node-${id}`} />;

  //     case CARD_TYPES.COMMERCE:
  //     case CARD_TYPES.COMMERCE_CAROUSEL:
  //       return <CommerceCard cards={cards as ICommerceCard[]} nodeId={`node-${id}`} />;

  //     case CARD_TYPES.QUICK_REPLY:
  //       return <QuickReply cards={cards as IQuickReply[]} nodeId={`node-${id}`} />;

  //     case CARD_TYPES.CONDITION:
  //       return <Condition cards={cards as ICondition[]} nodeId={`node-${id}`} />;

  //     case CARD_TYPES.COUNT:
  //       return <Count cards={cards as ICount[]} nodeId={`node-${id}`} />;
  //   }
  // };

  const handleShowingCards = (cards: INodeProps['cards']) => {
    if (!cards) {
      return <div></div>;
    }
    const cardType = cards[0].type;
    console.log('cards@', cards[0]);
    switch (cardType) {
      case NODE_TYPES.TEXT_NODE:
      case NODE_TYPES.IMAGE_NODE:
      case NODE_TYPES.BASIC_CARD_NODE:
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
      case NODE_TYPES.BASIC_CARD_CAROUSEL_TEMPLATE_NODE:
        return <BasicCard cards={cards as IBasicCard[]} nodeId={`node-${id}`} />;

      case NODE_TYPES.LIST:
      case NODE_TYPES.LIST_CAROUSEL:
        return <ListCard cards={cards as IListCard[]} nodeId={`node-${id}`} />;

      case NODE_TYPES.PRODUCT_CARD_NODE:
      case NODE_TYPES.PRODUCT_CARD_TEMPLATE_NODE:
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_TEMPLATE_NODE:
        return <CommerceCard cards={cards as ICommerceCard[]} nodeId={`node-${id}`} />;

      case NODE_TYPES.ANSWER_NODE:
        return <QuickReply cards={cards as IQuickReply[]} nodeId={`node-${id}`} />;

      case NODE_TYPES.CONDITION_NODE:
        return <Condition cards={cards as ICondition[]} nodeId={`node-${id}`} />;

      case NODE_TYPES.COUNT:
        return <Count cards={cards as ICount[]} nodeId={`node-${id}`} />;
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        const from = e.dataTransfer.getData('id');
        if (!from || id === from) {
          return;
        }
        addArrow?.(from, `node-${id}`);
      }}
      id={`node-${id}`}
      className={wrapClass}
      style={style}
      role="presentation"
      onMouseDown={(e) => {
        onClick?.(e);
      }}
      onMouseUp={(e) => e.stopPropagation()}
    >
      <div className={titleClass}>
        {title ? <p>{title}</p> : undefined}
        <Popper
          placement="right-start"
          // offset={[-10, 15]}
          popup
          popupList
          popperItems={nodeMenu}
          onChange={(m) => {
            m.data?.action?.();
          }}
        >
          <i className="fa-solid fa-ellipsis-vertical" />
        </Popper>
      </div>
      <div className={bodyClass}>
        {typeName === NODE_TYPES.INTENT_NODE && <div style={{ width: '190px' }}></div>}
        {typeName === NODE_TYPES.OTHER_FLOW_REDIRECT_NODE && (
          <div style={{ width: '190px' }}></div>
        )}
        {cards ? <>{handleShowingCards(cards)}</> : undefined}
      </div>
      {typeName !== NODE_TYPES.INTENT_NODE &&
        typeName !== NODE_TYPES.OTHER_FLOW_REDIRECT_NODE && (
          <Button shape="ghost" className="icNodeBottom">
            <div
              id={`node-bottom-${id}`}
              role="presentation"
              className="node-draggable-ignore"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('id', `node-${id}`);
                dispatch(setGuideStartNode(`node-${id}`));
              }}
              onDragEnd={(e) => {
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
  );
};
