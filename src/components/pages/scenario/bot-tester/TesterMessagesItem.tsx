import { imgNotFoundImg } from '@assets';
import { Divider, Space } from '@components/layout';
import { ITesterDataType, ITesterDebugMeta, TESTER_DATA_TYPES } from '@models';
import classNames from 'classnames';
import { SyntheticEvent } from 'react';
import MultiClamp from 'react-multi-clamp';

import { CardCarouselType } from './CardCarouselType';
import { ListCardCarouselType } from './ListCardCarouselType';
import { ProductCardCarouselType } from './ProductCardCarouselType';
import { TesterMessagesItemButton } from './TesterMessagesItemButton';
import { TesterSlide } from './TesterSlide';

export interface TesterProps {
  item: ITesterDataType;
  onClick: (debugMeta?: ITesterDebugMeta) => void;
}

export const TesterMessagesItem = ({ item, onClick }: TesterProps) => {
  const handleImgOnError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = imgNotFoundImg;
  };
  const itemType = () => {
    switch (item.type) {
      case TESTER_DATA_TYPES.text:
        return (
          <>
            {item.isMe ? (
              <div className="send">
                <div className="sendMessage">{item.value}</div>
              </div>
            ) : (
              <div
                role="presentation"
                className="reply"
                onClick={() => onClick(item.debugMeta)}
              >
                <div className="replyMessage">{item.value}</div>
              </div>
            )}
          </>
        );
      case TESTER_DATA_TYPES.card:
        return (
          <div
            className="basicCardContainer"
            role="presentation"
            onClick={() => onClick(item.debugMeta)}
          >
            {item.image ? (
              <img
                className={
                  item.image.imageAspectRatio === 0
                    ? 'cardImg_rectangle'
                    : 'cardImg_square'
                }
                src={item.image.imageUrl}
                alt="cardImg"
                onError={(e) => {
                  handleImgOnError(e);
                }}
              />
            ) : (
              <></>
            )}
            {item.title || item.contentText ? (
              <div className="cardText">
                {item.title && (
                  <div className="cardTitle">
                    <MultiClamp clamp={2} ellipsis={'...'}>
                      {item.title.substring(0, 39)}
                    </MultiClamp>
                  </div>
                )}
                {item.contentText && (
                  <div className="cardContentText">
                    <MultiClamp clamp={8} ellipsis={'...'}>
                      {item.contentText.substring(0, 229)}
                    </MultiClamp>
                  </div>
                )}
                {item.buttons.length > 0 && (
                  <div
                    className={
                      item.image?.imageAspectRatio === 0
                        ? 'rectangleImageBtn'
                        : 'squareImageBtn'
                    }
                  >
                    {item.buttons.map((v, i) => (
                      <TesterMessagesItemButton key={i} item={v} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="cardText">
                <div
                  className={classNames('rectangleImageBtn', {
                    squareImageBtn: item.image?.imageAspectRatio === 1,
                  })}
                >
                  {item.buttons.map((v, i) => (
                    <TesterMessagesItemButton key={i} item={v} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case TESTER_DATA_TYPES.cardCarousel:
        return (
          <div
            className="cardCarouselContainer"
            role="presentation"
            onClick={() => onClick(item.debugMeta)}
          >
            {item.contents.length === 0 ? null : (
              <TesterSlide gapSize={10} offset={55}>
                {item.contents?.map((c, i) => {
                  return (
                    <CardCarouselType
                      key={i}
                      item={c}
                      handleImgOnError={handleImgOnError}
                    />
                  );
                })}
              </TesterSlide>
            )}
          </div>
        );
      case TESTER_DATA_TYPES.listCard:
        return (
          <div
            className="listCardContainer"
            role="presentation"
            onClick={() => onClick(item.debugMeta)}
          >
            <div className="listCard">
              {item.header && (
                <div className="header">
                  <MultiClamp clamp={1} ellipsis={'...'}>
                    {item.header.substring(0, 39)}
                  </MultiClamp>
                </div>
              )}
              {item.image ? (
                <img
                  className={
                    item.image.imageAspectRatio === 0
                      ? 'listCardImg_rectangle'
                      : 'listCardImg_square'
                  }
                  src={item.image?.imageUrl}
                  alt="img"
                  onError={(e) => {
                    handleImgOnError(e);
                  }}
                />
              ) : (
                <></>
              )}
              <div className="listCardContentsWrap">
                <div className="listCardContents">
                  {item.items.map((x, i) => {
                    return (
                      <div key={i} className="listCardContent">
                        <div className="cardList">
                          <div className="listInfo">
                            <div className="infoTitle">
                              <MultiClamp clamp={2} ellipsis={'...'}>
                                {x.title.substring(0, 59)}
                              </MultiClamp>
                            </div>
                            <div className="infoDesc">
                              <MultiClamp clamp={1} ellipsis={'...'}>
                                {x.description.substring(0, 39)}
                              </MultiClamp>
                            </div>
                          </div>
                          <div className="listImg">
                            <img
                              src={x.image?.imageUrl}
                              alt="img"
                              onError={(e) => {
                                handleImgOnError(e);
                              }}
                            />
                          </div>
                        </div>
                        {item.items.length - 1 === i ? <Space /> : <Divider />}
                      </div>
                    );
                  })}
                  {item.image?.imageUrl && item.buttons.length > 0 ? (
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
                  ) : (
                    <div className="rectangleImageBtn">
                      {item.buttons?.map((v, i) => {
                        return <TesterMessagesItemButton key={i} item={v} />;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case TESTER_DATA_TYPES.listCardCarousel:
        return (
          <div
            className="listCardContainer"
            role="presentation"
            onClick={() => onClick(item.debugMeta)}
          >
            {item.contents.length === 0 ? null : (
              <TesterSlide gapSize={10} offset={55}>
                {item.contents.map((c, i) => {
                  return (
                    <ListCardCarouselType
                      key={i}
                      item={c}
                      handleImgOnError={handleImgOnError}
                    />
                  );
                })}
              </TesterSlide>
            )}
          </div>
        );
      case TESTER_DATA_TYPES.productCard:
        return (
          <div
            className="productCardContainer"
            role="presentation"
            onClick={() => onClick(item.debugMeta)}
          >
            <div className="productCard">
              <div>
                <img
                  className={
                    item.image?.imageAspectRatio === 0
                      ? 'productCardImg_rectangle'
                      : 'productCardImg_square'
                  }
                  src={item.image?.imageUrl}
                  alt="productCardImg"
                  onError={(e) => {
                    handleImgOnError(e);
                  }}
                />
              </div>
              <div className="productCardContents">
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
                    <MultiClamp clamp={1}>{item.title.substring(0, 39)}</MultiClamp>
                  </div>
                </div>
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
                      {item.description.substring(0, 59)}
                    </MultiClamp>
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
          </div>
        );
      case TESTER_DATA_TYPES.productCardCarousel:
        return (
          <div
            className="productCardContainer"
            role="presentation"
            onClick={() => onClick(item.debugMeta)}
          >
            {item.contents.length === 0 ? null : (
              <TesterSlide gapSize={10} offset={55}>
                {item.contents.map((c, i) => {
                  return (
                    <ProductCardCarouselType
                      key={i}
                      item={c}
                      handleImgOnError={handleImgOnError}
                    />
                  );
                })}
              </TesterSlide>
            )}
          </div>
        );
      case TESTER_DATA_TYPES.quickReplies:
        return (
          <div className="quickReplies">
            <TesterSlide gapSize={8} quickReplies>
              {item.quickReplies.map((v, i) => {
                return <TesterMessagesItemButton key={i} item={v} quickReply />;
              })}
            </TesterSlide>
          </div>
        );
    }
  };
  return <>{itemType ? <>{itemType()}</> : null}</>;
};
