import { Card } from '@components/data-display/Card';
import { Slick } from '@components/data-display/Slick';
import { Button } from '@components/general/Button';
import { Divider } from '@components/layout/Divider';
import classNames from 'classnames';
import { FC, useState } from 'react';
import { ICommerceCard } from 'src/models/interfaces/ICard';

interface CommerceCard {
  cards: ICommerceCard[];
}

export const CommerceCard: FC<CommerceCard> = ({ cards }) => {
  const discountPriceCss = classNames('discountPrice', { discounted: true });
  const [squareMode, setSquareMode] = useState<boolean>(false);
  const thumbnailClass = classNames('thumbnail', {
    square: squareMode,
  });

  return (
    <Slick>
      {cards.map((item, i) => (
        <Card key={i} hoverable onClick={() => console.log('card click')}>
          <div className={thumbnailClass}>
            {item.thumbnail?.imageUrl ? (
              <img src={item.thumbnail?.imageUrl} alt="thumbnailImage" />
            ) : (
              <div className="skeleton"></div>
            )}
          </div>

          <div className="profile">
            <img src={item.profile.imageUrl} alt="" />
            <span>{item.profile.nickname}</span>
          </div>
          <div className="priceWrapper">
            <div className="prices">
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
          </div>
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
    </Slick>
  );
};
