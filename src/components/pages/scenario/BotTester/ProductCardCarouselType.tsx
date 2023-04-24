import { ITesterCard } from '@models';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface ProductCardCarouselTypeProps {
  item: ITesterCard;
}

export const ProductCardCarouselType = ({ item }: ProductCardCarouselTypeProps) => {
  return (
    <div className="productCard">
      <img
        className={
          item.image?.imageAspectRatio === 0
            ? 'productCardImg_rectangle'
            : 'productCardImg_square'
        }
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
              {item.price?.sale
                ?.toFixed(0)
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              {item.price?.symbol}
            </p>
            <p className="prevPrice">
              {item.price?.retail
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
          {item.buttons.length > 0 ? (
            <div
              className={
                item.image?.imageAspectRatio === 0
                  ? 'rectangleImageBtn'
                  : 'squareImageBtn'
              }
            >
              {item.buttons?.map((v, i) => {
                return <TesterMessagesItemButton key={i} item={v} />;
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
