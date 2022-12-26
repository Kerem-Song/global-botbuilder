import { icCardDelete, icCardDuplication, icCardPaste, icNodeBottom } from '@assets';
import { Button, IPopperItem, Popper } from '@components';
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
  IBasicCard,
  ICommerceCard,
  ICondition,
  ICount,
  IListCard,
  IQuickReply,
} from '../../models/interfaces/ICard';
import { BasicCard } from '../../pages/scenario/cards/BasicCard';
import { CommerceCard } from '../../pages/scenario/cards/CommerceCard';
import { Condition } from '../../pages/scenario/cards/Condition';
import { Count } from '../../pages/scenario/cards/Count';
import { ListCard } from '../../pages/scenario/cards/ListCard';
import { QuickReply } from '../../pages/scenario/cards/QuickReply';

export interface INodeProps extends IHasChildren, IHasClassNameNStyle {
  id?: string;
  title?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  active?: boolean;
  radius?: SizeType;
  cards?:
    | IBasicCard[]
    | ICommerceCard[]
    | IListCard[]
    | IQuickReply[]
    | ICondition[]
    | ICount[];
  onClick?: (e?: any) => void;
  addArrow?: (from: string, to: string) => void;
  ref?: React.RefObject<HTMLDivElement | null>[];
}

export const Node: FC<INodeProps> = ({
  id,
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

  const handleNodeBottomBtn = () => {
    console.log('handle node bottom btn');
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

  const handleShowingCards = (cards: INodeProps['cards']) => {
    if (!cards) {
      return <div></div>;
    }
    const cardType = cards[0].type;
    switch (cardType) {
      case CARD_TYPES.TEXT:
      case CARD_TYPES.IMAGE:
      case CARD_TYPES.BUTTON_TEMPLATE:
      case CARD_TYPES.BUTTON_CAROUSEL:
        return <BasicCard cards={cards as IBasicCard[]} nodeId={`node-${id}`} />;

      case CARD_TYPES.LIST:
      case CARD_TYPES.LIST_CAROUSEL:
        return <ListCard cards={cards as IListCard[]} nodeId={`node-${id}`} />;

      case CARD_TYPES.COMMERCE:
      case CARD_TYPES.COMMERCE_CAROUSEL:
        return <CommerceCard cards={cards as ICommerceCard[]} nodeId={`node-${id}`} />;

      case CARD_TYPES.QUICK_REPLY:
        return <QuickReply cards={cards as IQuickReply[]} nodeId={`node-${id}`} />;

      case CARD_TYPES.CONDITION:
        return <Condition cards={cards as ICondition[]} nodeId={`node-${id}`} />;

      case CARD_TYPES.COUNT:
        return <Count cards={cards as ICount[]} nodeId={`node-${id}`} />;
    }
  };
  // const isCommerce = cards?.some((e) => Object.keys(e).includes('price'));
  // const isList = cards?.some((e) => Object.keys(e).includes('header'));
  // const isQuickReply = cards?.some((e) => Object.keys(e).includes('label'));
  // const isCondition = cards?.some((e) => Object.keys(e).includes('condition'));
  // const isCount = cards?.some((e) => Object.keys(e).includes('requestionNum'));

  // const handleShowingCards1 = (cards: INodeProps['cards']) => {
  //   if (isCommerce) {
  //     return <CommerceCard cards={cards as ICommerceCard[]} nodeId={`node-${id}`} />;
  //   } else if (isList) {
  //     return <ListCard cards={cards as IListCard[]} nodeId={`node-${id}`} />;
  //   } else if (isQuickReply) {
  //     return <QuickReply cards={cards as IQuickReply[]} nodeId={`node-${id}`} />;
  //   } else if (isCondition) {
  //     return <Condition cards={cards as ICondition[]} nodeId={`node-${id}`} />;
  //   } else if (isCount) {
  //     return <Count cards={cards as ICount[]} nodeId={`node-${id}`} />;
  //   } else {
  //     return <BasicCard cards={cards as IBasicCard[]} nodeId={`node-${id}`} />;
  //   }
  // };

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
      {cards ? <div className={bodyClass}>{handleShowingCards(cards)}</div> : undefined}

      <Button shape="ghost" className="icNodeBottom" onClick={handleNodeBottomBtn}>
        <div
          id={`node-bottom-${id}`}
          role="presentation"
          className="node-draggable-ignore"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('id', `node-${id}`);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <img src={icNodeBottom} alt="icNodeBottom" />
        </div>
      </Button>
    </div>
  );
};
