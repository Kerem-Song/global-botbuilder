import { Card } from '@components/data-display/Card';
import { Carousel } from '@components/data-display/Carousel';
import { SortableButtonContainer } from '@components/data-display/SortableButtonContainer';
import { Divider } from '@components/layout/Divider';
import classNames from 'classnames';
import { FC, useState } from 'react';
import { ICommerceCard } from 'src/models/interfaces/ICard';

interface CommerceCard {
  nodeId: string;
  cards: ICommerceCard[];
}

export const CommerceCard: FC<CommerceCard> = ({ nodeId, cards }) => {
  const discountPriceCss = classNames('discountPrice', { discounted: true });
  const [squareMode, setSquareMode] = useState<boolean>(false);
  const thumbnailClass = classNames('thumbnail', {
    square: squareMode,
  });

  return (
    <Carousel nodeId={nodeId}>
      {cards.map((item, i) => (
        <Card key={i} hoverable onClick={() => console.log('card click')}>
          {item.thumbnail ? (
            <div className={thumbnailClass}>
              {item.thumbnail?.imageUrl ? (
                <img src={item.thumbnail?.imageUrl} alt="thumbnailImage" />
              ) : (
                <div className="skeleton"></div>
              )}
            </div>
          ) : null}

          {item.profile ? (
            <>
              <div className="profile">
                {item.profile?.imageUrl ? (
                  <img src={item.profile.imageUrl} alt="profileImage" />
                ) : (
                  <div className="skeleton"></div>
                )}
                {item.profile?.brandName ? (
                  <span>{item.profile.brandName}</span>
                ) : (
                  <span className="empty">Enter Brand Name</span>
                )}
              </div>
              <Divider className="commerceDivider" />
            </>
          ) : null}

          {item.price !== undefined ? (
            <div className="priceWrapper">
              {item.discount && (
                <div>
                  <span className="discounted">{item.price}</span>
                  <span className="discount">
                    {item.discount} <span className="currency">{item.currency}</span>{' '}
                    Discount
                  </span>
                </div>
              )}
              <div className="prices">
                {item.price ? (
                  <p>
                    {item.discount ? item.price - item.discount : item.price}
                    <span className="currency">{item.currency}</span>
                  </p>
                ) : (
                  <p className="empty">
                    {item.price} <span className="currency">{item.currency}</span>
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {item.productName !== undefined ? (
            <div className={classNames('productName', item.productName ? '' : 'empty')}>
              {item.productName ? <p>{item.productName}</p> : <p>Enter Product Name</p>}
            </div>
          ) : null}

          <div className="buttonWrapper node-draggable-ignore">
            {item.buttons && (
              <SortableButtonContainer cardButtons={item.buttons} cardId={i} />
            )}
          </div>
        </Card>
      ))}
    </Carousel>
  );
};
