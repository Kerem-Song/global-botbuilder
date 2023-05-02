import { ITesterCard } from '@models';

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
          <div className="cardCarouselTitle">{item.title}</div>
          <div className="cardCarouselDesc">{item.contentText}</div>
        </div>
      ) : null}
      {item.buttons.map((v, i) => {
        return <TesterMessagesItemButton cardCarousel key={i} item={v} />;
      })}
    </div>
  );
};