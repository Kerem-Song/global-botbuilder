import { BasicCard } from '@components/cards/BasicCard';
import { CommerceCard } from '@components/cards/CommerceCard';
import { Button } from '@components/general/Button';
import classNames from 'classnames';
import { useState } from 'react';
import { FC } from 'react';
import { IBasicCard, ICommerceCard } from 'src/models/interfaces/ICard';
import { IHasChildren } from 'src/models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from 'src/models/interfaces/IHasStyle';
import { SizeType } from 'src/models/types/SizeType';

import { dummy2 } from '../../dummy';
import useI18n from '../../hooks/useI18n';
export interface CarouselProps extends IHasChildren, IHasClassNameNStyle {
  title?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  radius?: SizeType;
  cards?: IBasicCard[] | ICommerceCard[];
  onClick?: () => void;
}

export const Carousel: FC<CarouselProps> = ({
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
  const wrapClass = classNames(className, 'luna-carousel', {
    'luna-carousel-bordered': bordered,
    'luna-carousel-hoverble': hoverable,
    [`border-radious-${radius}`]: radius !== 'none',
    'luna-carousel-fold': isFolded,
  });

  const titleClass = classNames('luna-carousel-head');
  const bodyClass = classNames('luna-carousel-body');

  const handleFoldCarousel = () => {
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
        <Button onClick={handleCardSettingBtn}>:</Button>
      </div>
      {cards ? (
        <div className={bodyClass}>
          <BasicCard cards={cards} />
          {/* <CommerceCard cards={dummy2} /> */}
          <div className="addCardBtn">
            <Button onClick={() => console.log('말풍선 추가')}>+ 말풍선 추가</Button>
          </div>
          <div className="dropBtn">
            <Button onClick={handleFoldCarousel}>*</Button>
          </div>
        </div>
      ) : undefined}
    </div>
  );
};
