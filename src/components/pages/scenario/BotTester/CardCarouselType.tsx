import { ITesterCard } from '@models';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface CardCarouselTypeProps {
  item: ITesterCard;
}

export const CardCarouselType = ({ item }: CardCarouselTypeProps) => {
  return (
    <div className="cardCarousel">
      <img className="cardCarouselImg" src={item.image?.imageUrl} alt="cardCarouselImg" />
      {item.buttons.map((v, i) => {
        return <TesterMessagesItemButton cardCarousel key={i} item={v} />;
      })}
    </div>
  );
};
