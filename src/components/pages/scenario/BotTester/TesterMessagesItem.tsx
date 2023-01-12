import { ITesterDataType, ITesterDebugMeta, TESTER_DATA_TYPES } from '@models';

import { CardCarouselType } from './CardCarouselType';
import { ProductCardCarouselType } from './ProductCardCarouselType';
import { TesterMessagesItemButton } from './TesterMessagesItemButton';
import { TesterSlide } from './TesterSlide';

export interface TesterProps {
  item: ITesterDataType;
  onClick: (debugMeta?: ITesterDebugMeta) => void;
}

export const TesterMessagesItem = ({ item, onClick }: TesterProps) => {
  const itemType = () => {
    switch (item.type) {
      case TESTER_DATA_TYPES.text:
        return (
          <>
            {item.isMe === true ? (
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
                  return <ProductCardCarouselType key={i} item={c} />;
                })}
              </TesterSlide>
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
                  return <CardCarouselType key={i} item={c} />;
                })}
              </TesterSlide>
            )}
          </div>
        );
      case TESTER_DATA_TYPES.card:
        return (
          <div
            className="basicCardContainer"
            role="presentation"
            onClick={() => onClick(item.debugMeta)}
          >
            <div className="cardText">
              {item.title ? <div className="cardTitle">{item.title}</div> : null}
              <div className="cardContentText">{item.contentText}</div>
            </div>
            <div className="cardBtnList">
              {item.buttons?.map((v, i) => {
                return <TesterMessagesItemButton card key={i} item={v} />;
              })}
            </div>
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
                      {item.price?.net
                        ?.toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                      {item.price?.symbol}
                    </p>
                    <p className="prevPrice">
                      {item.price?.gross
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
          </div>
        );
      case TESTER_DATA_TYPES.image:
        return (
          <div
            className="imageCardContainer"
            role="presentation"
            onClick={() => onClick(item.debugMeta)}
          >
            <img className="imageCardImg contain" src={item.imageUrl} alt="fullSizeImg" />
          </div>
        );
      case TESTER_DATA_TYPES.quickReplies:
        return (
          <div className="quickReplies">
            <TesterSlide gapSize={8} quickReplies>
              {item.quickReplies.map((v, i) => {
                return <TesterMessagesItemButton quickReply key={i} item={v} />;
              })}
            </TesterSlide>
          </div>
        );
    }
  };
  return <>{itemType ? <>{itemType()}</> : null}</>;
};
