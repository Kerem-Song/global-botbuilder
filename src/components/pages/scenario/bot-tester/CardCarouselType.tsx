import { ITesterCard } from '@models';
import MultiClamp from 'react-multi-clamp';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface CardCarouselTypeProps {
  item: ITesterCard;
}

export const CardCarouselType = ({ item }: CardCarouselTypeProps) => {
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
              return <TesterMessagesItemButton cardCarousel key={i} item={v} />;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
