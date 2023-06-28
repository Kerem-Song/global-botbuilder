import { ITesterCard } from '@models';
import classNames from 'classnames';
import { FC, SyntheticEvent } from 'react';
import MultiClamp from 'react-multi-clamp';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface ICardCarouselTypeProps {
  item: ITesterCard;
  handleImgOnError: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const CardCarouselType: FC<ICardCarouselTypeProps> = ({
  item,
  handleImgOnError,
}) => {
  return (
    <div className="cardCarousel">
      {item.image && (
        <img
          className={
            item.image?.imageAspectRatio === 0
              ? 'cardCarouselImg_rectangle'
              : 'cardCarouselImg_square'
          }
          src={item.image?.imageUrl}
          alt="cardCarouselImg"
          onError={(e) => {
            handleImgOnError(e);
          }}
        />
      )}
      {item.title || item.contentText ? (
        <div className="cardCarouselContents">
          <div className="cardCarouselTitle">
            <MultiClamp clamp={2} ellipsis={'...'}>
              {item.title.substring(0, 39)}
            </MultiClamp>
          </div>
          <div className="cardCarouselDesc">
            <MultiClamp clamp={8}>{item.contentText?.substring(0, 229)}</MultiClamp>
          </div>
          <div
            className={
              item.image?.imageAspectRatio === 0 ? 'rectangleImageBtn' : 'squareImageBtn'
            }
          >
            {item.buttons.map((v, i) => {
              return <TesterMessagesItemButton key={i} item={v} />;
            })}
          </div>
        </div>
      ) : (
        <div className="cardCarouselContents">
          <div
            className={classNames('rectangleImageBtn', {
              squareImageBtn: item.image?.imageAspectRatio === 1,
            })}
          >
            {item.buttons.map((v, i) => (
              <TesterMessagesItemButton key={i} item={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
