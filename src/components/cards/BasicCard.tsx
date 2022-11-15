import { Card } from '@components/data-display/Card';
import { Button } from '@components/general/Button';
import { FC } from 'react';
import { IBasicCard } from 'src/models/interfaces/ICard';

interface BasicCard {
  cards: IBasicCard[];
}

export const BasicCard: FC<BasicCard> = ({ cards }) => {
  return (
    <div className="cards">
      {cards.map((item, i) => (
        <Card key={i} hoverable onClick={() => console.log('card click')}>
          {item.thumbnail?.imageUrl && (
            <div className="thumbnail">
              <img src={item.thumbnail?.imageUrl} alt="" />
            </div>
          )}
          {item.title && (
            <div>
              <p>{item.title}</p>
            </div>
          )}
          {item.description && (
            <div>
              <p>{item.description}</p>
            </div>
          )}
          <div className="buttonWrapper">
            {item.buttons?.map((button, i) => {
              return <Button key={i}>{button.label}</Button>;
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};
