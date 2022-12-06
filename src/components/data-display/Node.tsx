import { Button } from '@components/general/Button';
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
        {title ? <p className={titleClass}>{title}</p> : undefined}
        <Button onClick={handleCardSettingBtn}>
          <i className="fa-solid fa-ellipsis-vertical" />
        </Button>
      </div>
      {cards ? (
        <div className={bodyClass}>
          <BasicCard cards={cards} />
          {/* <CommerceCard cards={dummy2} /> */}
          <div className="addCardBtn">
            <Button onClick={() => console.log('말풍선 추가')}>+ 말풍선 추가</Button>
          </div>
          <div className="dropBtn">
            <Button onClick={handleFoldNode}>
              {isFolded ? (
                <i className="fa-solid fa-chevron-right"></i>
              ) : (
                <i className="fa-solid fa-chevron-left"></i>
              )}
            </Button>
          </div>
        </div>
      ) : undefined}
    </div>
  );
};
