import { Card } from '@components/data-display/Card';
import { Button } from '@components/general/Button';
import { Divider } from '@components/layout/Divider';
import classNames from 'classnames';
import { FC } from 'react';
import { ICommerceCard } from 'src/models/interfaces/ICard';

interface CommerceCard {
  cards: ICommerceCard[];
}

export const CommerceCard: FC<CommerceCard> = ({ cards }) => {
  const discountPriceCss = classNames('discountPrice', { discounted: true });

  return (
    <div className="cards">
      {cards.map((item, i) => (
        <Card key={i} hoverable onClick={() => console.log('card click')}>
          {item.thumbnail?.imageUrl && (
            <div className="thumbnail">
              <img src={item.thumbnail?.imageUrl} alt="" />
            </div>
          )}
          <div className="profile">
            <img src={item.profile.imageUrl} alt="" />
            <span>{item.profile.nickname}</span>
          </div>

          <div className="priceWrapper">
            {item.discountPrice && (
              <p>
                {item.discountPrice}
                {item.currency}
              </p>
            )}

            <p
              className={classNames(
                'discountPrice',
                item.discountPrice ? 'discounted' : '',
              )}
            >
              {item.price}
            </p>
          </div>
          {item.discount && (
            <div>
              <p className="discount">
                {item.discount}
                discount
              </p>
            </div>
          )}
          <Divider />
          <div className="description">
            <p>{item.description}</p>
          </div>

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
