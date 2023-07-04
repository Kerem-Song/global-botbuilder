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
    <div
      className={classNames('cardCarousel', {
        rectangleImageCardCarousel: item.image?.imageAspectRatio === 0,
        squareImageCardCarousel: item.image?.imageAspectRatio != 0,
      })}
    >
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
        <div
          className={classNames('cardCarouselContents', {
            rectangleImageContents: item.image?.imageAspectRatio === 0,
            squareImageContents: item.image?.imageAspectRatio != 0,
          })}
        >
          <div>
            <div className="cardCarouselTitle">
              <MultiClamp clamp={2} ellipsis={'...'}>
                {item.title.substring(0, 40)}
              </MultiClamp>
            </div>
            <div className="cardCarouselDesc">
              <MultiClamp clamp={8}>{item.contentText?.substring(0, 230)}</MultiClamp>
            </div>
          </div>
          <div>
            <div
              className={classNames('rectangleImageBtn', {
                squareImageBtn: item.image?.imageAspectRatio === 1,
              })}
            >
              {item.buttons.map((v, i) => {
                return <TesterMessagesItemButton key={i} item={v} />;
              })}
            </div>
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
