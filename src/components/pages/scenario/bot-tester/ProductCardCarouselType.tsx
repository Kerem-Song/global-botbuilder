import { IProductCard } from '@models';
import classNames from 'classnames';
import { FC, SyntheticEvent } from 'react';
import MultiClamp from 'react-multi-clamp';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface IProductCardCarouselTypeProps {
  item: IProductCard;
  handleImgOnError: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const ProductCardCarouselType: FC<IProductCardCarouselTypeProps> = ({
  item,
  handleImgOnError,
}) => {
  const isSquareImage = item.image?.imageAspectRatio === 1;

  return (
    <div
      className={classNames('productCard', {
        productCarouselSquareImageCard: isSquareImage,
        productCarouselRectangleImageCard: !isSquareImage,
      })}
    >
      <div>
        <img
          className={isSquareImage ? 'productCardImg_square' : 'productCardImg_rectangle'}
          src={item.image?.imageUrl}
          alt="productCardCarouselImg"
          onError={(e) => {
            handleImgOnError(e);
          }}
        />
      </div>
      <div className="productCardContents productCardCarouselContents">
        <div>
          <div className="productCardTitle">
            <div className="title">
              <img
                className="icon"
                src={item.icon.url}
                alt="iconImg"
                onError={(e) => {
                  handleImgOnError(e);
                }}
              />
              <MultiClamp clamp={1}>{item.title?.substring(0, 40)}</MultiClamp>
            </div>
          </div>
          <div className="productCardCarouselWrap">
            <div className="productCardPrices">
              {item.price?.isShowDiscount && (
                <>
                  <div className="price">
                    <p className="prevPrice">{item.price.retailDisplay}</p>
                  </div>
                  <div className="discount">
                    <p className="discountAmount">{item.price.discountDisplay}</p>
                  </div>
                </>
              )}
              <div className="price">
                <p className="currentPrice">{item.price?.mainDisplay}</p>
              </div>
            </div>
            <div className="productContents">
              <div className="productDesc">
                <MultiClamp clamp={2} ellipsis={'...'}>
                  {item.description?.substring(0, 60)}
                </MultiClamp>
              </div>
            </div>
          </div>
        </div>
        <div className="productCardCarouselBtnWrap">
          {item.buttons.length > 0 ? (
            <div className={isSquareImage ? 'squareImageBtn' : 'rectangleImageBtn'}>
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
