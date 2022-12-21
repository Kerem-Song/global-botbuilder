import { Card } from '@components/data-display/Card';
import { Carousel } from '@components/data-display/Carousel';
import { Button } from '@components/general/Button';
import classNames from 'classnames';
import { FC, useState } from 'react';

import { IBasicCard, TCardType } from '../../../models/interfaces/ICard';

interface BasicCard {
  nodeId: string;
  cards: IBasicCard[];
}

export const BasicCard: FC<BasicCard> = ({ nodeId, cards }) => {
  const [squareMode, setSquareMode] = useState<boolean>(false);
  const thumbnailClass = classNames('thumbnail', {
    square: squareMode,
  });
  const cardType: TCardType = 'image';

  return (
    <Carousel nodeId={nodeId}>
      {cards.map((item, i) => (
        <Card key={`card-${i}`} onClick={() => console.log('card click')}>
          <div className={thumbnailClass}>
            {item.thumbnail?.imageUrl ? (
              <img src={item.thumbnail?.imageUrl} alt="thumbnailImage" />
            ) : (
              <div className="skeleton"></div>
            )}
          </div>

          <div className={classNames('title', { empty: item.title })}>
            {item.title ? <p>{item.title}</p> : <p>Enter Title</p>}
          </div>

          <div className={classNames('description', { empty: item.description })}>
            {item.description ? <p>{item.description}</p> : <p>Enter Content</p>}
          </div>

          <div className="buttonWrapper">
            {item.buttons?.map((button, j) => {
              return (
                <>
                  <Button key={`card-${i}-button-${j}`}>{button.label}</Button>
                </>
              );
            })}
          </div>
        </Card>
      ))}
    </Carousel>
  );
};
