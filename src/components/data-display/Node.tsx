import { icCardDelete, icCardDuplication, icCardPaste, icNodeBottom } from '@assets';
import { Button, IPopperItem, Popper } from '@components';
import classNames from 'classnames';
import { FC } from 'react';
import { IBasicCard, ICommerceCard } from 'src/models/interfaces/ICard';
import { IHasChildren } from 'src/models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from 'src/models/interfaces/IHasStyle';
import { SizeType } from 'src/models/types/SizeType';

import { QuickReply } from '../..//pages/scenario/cards/QuickReply';
import { dummy2 } from '../../dummy';
import useI18n from '../../hooks/useI18n';
import { BasicCard } from '../../pages/scenario/cards/BasicCard';
import { CommerceCard } from '../../pages/scenario/cards/CommerceCard';

export interface INodeProps extends IHasChildren, IHasClassNameNStyle {
  id?: string;
  title?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  active?: boolean;
  radius?: SizeType;
  cards?: IBasicCard[] | ICommerceCard[];
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
        >
          <i className="fa-solid fa-ellipsis-vertical" />
        </Popper>
      </div>
      {cards ? (
        <div className={bodyClass}>
          <BasicCard cards={cards} nodeId={`node-${id}`} />
          {/* <CommerceCard cards={dummy2} /> */}
          {/* <QuickReply /> */}
        </div>
      ) : undefined}

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
