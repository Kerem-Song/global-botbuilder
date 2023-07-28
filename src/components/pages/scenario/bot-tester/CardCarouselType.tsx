import { ITesterCard } from '@models';
import classNames from 'classnames';
import { FC, SyntheticEvent } from 'react';
import MultiClamp from 'react-multi-clamp';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface ICardCarouselTypeProps {
  item: ITesterCard;
  contents: ITesterCard[];
  handleImgOnError: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const CardCarouselType: FC<ICardCarouselTypeProps> = ({
  item,
  contents,
  handleImgOnError,
}) => {
  const isRectangleImage = item.image?.imageAspectRatio === 0;
  const hasTitleAndContent = item.title && item.contentText;
  const hasButtons = item.buttons.length > 0;
  const onlyCardCarouselImage = contents.every(
    (x) => x.title.length === 0 && x.contentText?.length === 0 && x.buttons.length === 0,
  );
  return (
    <div
      className={classNames('cardCarousel', {
        rectangleImageCardCarousel: isRectangleImage,
        squareImageCardCarousel: !isRectangleImage,
      })}
    >
      {item.image && (
        <img
          className={classNames('cardCarouselImg', {
            cardCarouselImg_rectangle: isRectangleImage,
            onlyCardCarouselImg_rectangle:
              onlyCardCarouselImage &&
              isRectangleImage &&
              !hasTitleAndContent &&
              !hasButtons,
            cardCarouselImg_square: !isRectangleImage,
            onlyCardCarouselImg_square:
              onlyCardCarouselImage &&
              !isRectangleImage &&
              !hasTitleAndContent &&
              !hasButtons,
          })}
          src={item.image.imageUrl}
          alt="cardCarouselImg"
          onError={(e) => {
            handleImgOnError(e);
          }}
        />
      )}
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
                {item.title.substring(0, 40)}
              </MultiClamp>
            </div>
            <div className="cardCarouselDesc">
              <MultiClamp clamp={8}>{item.contentText?.substring(0, 230)}</MultiClamp>
            </div>
          </div>
          <div>
            <div className={isRectangleImage ? 'rectangleImageBtn' : 'squareImageBtn'}>
              {item.buttons.map((v, i) => {
                return <TesterMessagesItemButton key={i} item={v} />;
              })}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={classNames('cardCarouselContents', {
            rectangleImageContents: isRectangleImage,
            onlyRectangleImageContents: isRectangleImage && !hasButtons,
            squareImageContents: !isRectangleImage,
            onlySquareImageContents: !isRectangleImage && !hasButtons,
          })}
        >
          <div className={isRectangleImage ? 'rectangleImageBtn' : 'squareImageBtn'}>
            {item.buttons.map((v, i) => (
              <TesterMessagesItemButton key={i} item={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
