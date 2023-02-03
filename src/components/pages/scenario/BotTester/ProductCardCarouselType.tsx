import { ITesterCard } from '@models';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface ProductCardCarouselTypeProps {
  item: ITesterCard;
}

export const ProductCardCarouselType = ({ item }: ProductCardCarouselTypeProps) => {
  return (
    <div className="productCard">
      <img
        className="productCardImg"
        src={item.image?.imageUrl}
        alt="productCardCarouselImg"
      />
      <div className="productCardContents">
        <div className="productCardTitle">
          <div className="title">
            <img className="icon" src={item.icon.url} alt="iconImg" />
            <p className="name">{item.title}</p>
          </div>
        </div>
        <div className="productCardPrices">
          <div className="price">
            <p className="currentPrice">
              {item.price?.salePrice
                ?.toFixed(0)
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              {item.price?.symbol}
            </p>
            <p className="prevPrice">
              {item.price?.retailPrice
                ?.toFixed(0)
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              {item.price?.symbol}
            </p>
          </div>
          <div className="discount">
            <p className="discountPrice">
              {item.price?.discount
                ?.toFixed(0)
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              {item.price?.symbol}↓
            </p>
          </div>
        </div>
        <div className="productContents">
          <div className="productDesc">
            <p className="desc">{item.description}</p>
          </div>
          <div className="productBtn">
            {item.buttons?.map((v, i) => {
              return <TesterMessagesItemButton key={i} item={v} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
