import { icCardDelete, icCardDuplication, icCardPaste, icNodeBottom } from '@assets';
import { Button, IPopperItem, Popper } from '@components';
import { useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { setGuideStartNode } from '@store/botbuilderSlice';
import { removeItem } from '@store/makingNode';
import classNames from 'classnames';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { IBasicCard, ICommerceCard, IListCard } from 'src/models/interfaces/ICard';
import { IHasChildren } from 'src/models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from 'src/models/interfaces/IHasStyle';
import { SizeType } from 'src/models/types/SizeType';

import { QuickReply } from '../..//pages/scenario/cards/QuickReply';
import { dummy2 } from '../../dummy';
import useI18n from '../../hooks/useI18n';
import { BasicCard } from '../../pages/scenario/cards/BasicCard';
import { CommerceCard } from '../../pages/scenario/cards/CommerceCard';
import { ListCard } from '../../pages/scenario/cards/ListCard';

export interface INodeProps extends IHasChildren, IHasClassNameNStyle {
  id?: string;
  title?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  active?: boolean;
  radius?: SizeType;
  cards?: IBasicCard[] | ICommerceCard[] | IListCard[];
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
  const isCommerce = cards?.some((e) => Object.keys(e).includes('price'));
  const isList = cards?.some((e) => Object.keys(e).includes('header'));
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
      {cards ? (
        <div className={bodyClass}>
          {isList ? (
            <ListCard cards={cards as IListCard[]} nodeId={`node-${id}`} />
          ) : !isCommerce ? (
            <BasicCard cards={cards as IBasicCard[]} nodeId={`node-${id}`} />
          ) : (
            <CommerceCard cards={cards as ICommerceCard[]} nodeId={`node-${id}`} />
          )}

          {/* <QuickReply /> */}
        </div>
      ) : undefined}

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
    </div>
  );
};
