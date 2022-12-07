import { icCardDelete, icCardDuplication, icCardPaste } from '@assets';
import { Popper } from '@components';
import classNames from 'classnames';
import { useState } from 'react';
import { FC } from 'react';
import { IBasicCard, ICommerceCard } from 'src/models/interfaces/ICard';
import { IHasChildren } from 'src/models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from 'src/models/interfaces/IHasStyle';
import { SizeType } from 'src/models/types/SizeType';

import { CommerceCard } from '../..//pages/scenario/cards/CommerceCard';
import { dummy2 } from '../../dummy';
import useI18n from '../../hooks/useI18n';
import { BasicCard } from '../../pages/scenario/cards/BasicCard';
export interface INodeProps extends IHasChildren, IHasClassNameNStyle {
  title?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  radius?: SizeType;
  cards?: IBasicCard[] | ICommerceCard[];
  onClick?: () => void;
}

export const Node: FC<INodeProps> = ({
  cards,
  className,
  style,
  title,
  bordered = true,
  hoverable,
  radius = 'small',
  onClick,
}) => {
  const { tc } = useI18n();
  const [isFolded, setIsFolded] = useState<boolean>(false);
  const wrapClass = classNames(className, 'luna-node', {
    'luna-node-bordered': bordered,
    'luna-node-hoverble': hoverable,
    [`border-radious-${radius}`]: radius !== 'none',
    'luna-node-fold': isFolded,
  });

  const titleClass = classNames('luna-node-head');
  const bodyClass = classNames('luna-node-body');

  const handleFoldNode = () => {
    setIsFolded(!isFolded);
  };

  const handleCardSettingBtn = () => {
    console.log('handle card setting');
  };

  const handleDuplicationCard = () => {
    console.log('handle duplication');
  };

  const handlePasteCard = () => {
    console.log('handle Paste');
  };

  const handleDeleteCard = () => {
    console.log('handle delete card');
  };

  const nodeMenu = [
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
      className={wrapClass}
      style={style}
      role="presentation"
      onClick={() => {
        onClick?.();
      }}
    >
      <div className={titleClass}>
        {title ? <p>{title}</p> : undefined}
        <Popper
          placement="right-start"
          // offset={[-10, 15]}
          popup
          popupList
          popperItems={[
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
          ]}
        >
          <i className="fa-solid fa-ellipsis-vertical" />
        </Popper>
      </div>
      {cards ? (
        <div className={bodyClass}>
          <BasicCard cards={cards} />
          {/* <CommerceCard cards={dummy2} /> */}
        </div>
      ) : undefined}
    </div>
  );
};
