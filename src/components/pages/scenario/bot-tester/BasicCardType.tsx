import { IBasicCard, ITesterDebugMeta } from '@models';
import classNames from 'classnames';
import { FC, SyntheticEvent } from 'react';
import MultiClamp from 'react-multi-clamp';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface IBasicCardTypeProps {
  item: IBasicCard;
  onClick: (debugMeta?: ITesterDebugMeta) => void;
  handleImgOnError: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const BasicCardType: FC<IBasicCardTypeProps> = ({
  item,
  onClick,
  handleImgOnError,
}) => {
  const isRectangleImage = item.image?.imageAspectRatio !== 1;
  const hasButtons = item.buttons && item.buttons.length > 0;
  const onlyCardImage =
    item.title?.length === 0 &&
    item.contentText?.length === 0 &&
    item.buttons &&
    item.buttons.length === 0;
  return (
    <div
      className="basicCardContainer"
      role="presentation"
      onClick={() => onClick(item.debugMeta)}
    >
      {item.image && (
        <img
          className={classNames('cardImg', {
            cardImgRectangle: !onlyCardImage && isRectangleImage,
            onlyCardImgRectangle: onlyCardImage && isRectangleImage,
            cardImgSquare: !onlyCardImage && !isRectangleImage,
            onlyCardImgSquare: onlyCardImage && !isRectangleImage,
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
          className={classNames('cardContents', {
            rectangleImageContents: isRectangleImage,
            squareImageContents: !isRectangleImage,
          })}
        >
          <div>
            <div className="cardTitle">
              <MultiClamp clamp={2} ellipsis={'...'}>
                {item.title?.substring(0, 40)}
              </MultiClamp>
            </div>
            <div className="cardContentDesc">{item.contentText?.substring(0, 230)}</div>
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
          className={classNames('cardContents', {
            rectangleImageContents: !onlyCardImage && isRectangleImage,
            onlyRectangleImageContents: onlyCardImage && isRectangleImage,
            squareImageContents: !onlyCardImage && !isRectangleImage,
            onlySquareImageContents: onlyCardImage && !isRectangleImage,
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
