import { IBasicCard } from '@models';
import classNames from 'classnames';
import { FC, SyntheticEvent } from 'react';
import MultiClamp from 'react-multi-clamp';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface ICardCarouselTypeProps {
  item: IBasicCard;
  contents: IBasicCard[];
  handleImgOnError: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const BasicCardCarouselType: FC<ICardCarouselTypeProps> = ({
  item,
  contents,
  handleImgOnError,
}) => {
  const isRectangleImage = item.image?.imageAspectRatio != 1;
  const hasButtons = item.buttons && item.buttons.length > 0;
  const onlyCardCarouselImage = contents.every((x) => {
    if (x.title && x.buttons) {
      x.title.length === 0 && x.contentText?.length === 0 && x.buttons.length === 0;
    }
  });
  return (
    <div
      className={classNames('cardCarousel', {
        rectangleImageCardCarousel: isRectangleImage,
        squareImageCardCarousel: !isRectangleImage,
      })}
    >
      <div
        className={
          isRectangleImage ? 'cardCarouselRectangleImgWrap' : 'cardCarouselSquareImgWrap'
        }
      >
        {item.image && (
          <img
            className={classNames('cardCarouselImg', {
              cardCarouselImgRectangle: !onlyCardCarouselImage && isRectangleImage,
              onlyCardCarouselImgRectangle: onlyCardCarouselImage && isRectangleImage,
              cardCarouselImgSquare: !onlyCardCarouselImage && !isRectangleImage,
              onlyCardCarouselImgSquare: onlyCardCarouselImage && !isRectangleImage,
            })}
            src={item.image.imageUrl}
            alt="cardCarouselImg"
            onError={(e) => {
              handleImgOnError(e);
            }}
          />
        )}
      </div>
      {item.title || item.contentText ? (
        <div
          className={classNames('cardCarouselContents', {
            rectangleImageContents: isRectangleImage,
            squareImageContents: !isRectangleImage,
          })}
        >
          <div>
            <div className="cardCarouselTitle">
              <MultiClamp clamp={2} ellipsis={'...'}>
                {item.title?.substring(0, 40)}
              </MultiClamp>
            </div>
            <div className="cardCarouselDesc">
              <MultiClamp clamp={8}>{item.contentText?.substring(0, 230)}</MultiClamp>
            </div>
          </div>
          <div className={hasButtons ? 'hasBtns' : undefined}>
            <div className={isRectangleImage ? 'rectangleImageBtn' : 'squareImageBtn'}>
              {item.buttons?.map((v, i) => {
                return <TesterMessagesItemButton key={i} item={v} />;
              })}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={classNames('cardCarouselContents', {
            rectangleImageContents: !onlyCardCarouselImage && isRectangleImage,
            onlyRectangleImageContents: onlyCardCarouselImage && isRectangleImage,
            squareImageContents: !onlyCardCarouselImage && !isRectangleImage,
            onlySquareImageContents: onlyCardCarouselImage && !isRectangleImage,
          })}
        >
          <div className={isRectangleImage ? 'rectangleImageBtn' : 'squareImageBtn'}>
            {item.buttons?.map((v, i) => (
              <TesterMessagesItemButton key={i} item={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
