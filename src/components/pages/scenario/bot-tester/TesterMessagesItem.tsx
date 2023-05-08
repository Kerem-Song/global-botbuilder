import { Divider } from '@components/layout';
import { ITesterDataType, ITesterDebugMeta, TESTER_DATA_TYPES } from '@models';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('botTest');
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
          <>
            {item.image || item.title || item.contentText || item.buttons.length > 0 ? (
              <>
                <div
                  className="basicCardContainer"
                  role="presentation"
                  onClick={() => onClick(item.debugMeta)}
                >
                  {item.image && (
                    <img
                      className={
                        item.image.imageAspectRatio === 0
                          ? 'cardImg_rectangle'
                          : 'cardImg_square'
                      }
                      src={item.image.imageUrl}
                      alt="cardImg"
                    />
                  )}
                  {item.title || item.contentText ? (
                    <div className="cardText">
                      {item.title && <div className="cardTitle">{item.title}</div>}
                      {item.contentText && (
                        <div className="cardContentText">{item.contentText}</div>
                      )}
                    </div>
                  ) : null}
                  {item.buttons.length > 0 && (
                    <div className="cardBtnList">
                      {item.buttons.map((v, i) => (
                        <TesterMessagesItemButton key={i} item={v} card />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
          </>
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
                  {item.price?.retail !== item.price?.sale ? (
                    <div className="price">
                      <p className="prevPrice">
                        {item.price?.retail
                          ?.toFixed(0)
                          ?.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                        {item.price?.symbol}
                      </p>
                    </div>
                  ) : null}
                  {item.price?.discount ? (
                    <div className="discount">
                      <p className="discountPrice">
                        {item.price?.discount
                          ?.toFixed(0)
                          ?.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        {item.price?.symbol} {t('DISCOUNT')}
                      </p>
                    </div>
                  ) : null}
                  <div className="price">
                    <p className="currentPrice">
                      {item.price?.sale
                        ?.toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                      {item.price?.symbol}
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
              {item.header && <div className="header">{item.header}</div>}
              {item.image?.imageUrl && (
                <img
                  className={
                    item.image.imageAspectRatio === 0
                      ? 'listCardImg_rectangle'
                      : 'listCardImg_square'
                  }
                  src={item.image?.imageUrl}
                  alt="img"
                ></img>
              )}
              {item.items.map((x, i) => {
                return (
                  <div key={i}>
                    <div className="cardList">
                      <div className="listInfo">
                        <div className="infoTitle">{x.title}</div>
                        <div className="infoDesc">{x.description}</div>
                      </div>
                      <div className="listImg">
                        <img src={x.image?.imageUrl} alt="img"></img>
                      </div>
                    </div>
                    {item.items.length - 1 === i ? (
                      <></>
                    ) : (
                      <div className="dividerWrap">
                        <Divider />
                      </div>
                    )}
                  </div>
                );
              })}
              {item.buttons.length > 0 ? (
                <div className="listCardBtns">
                  {item.buttons?.map((v, i) => {
                    return <TesterMessagesItemButton cardCarousel key={i} item={v} />;
                  })}
                </div>
              ) : null}
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
                  return <ListCardCarouselType key={i} item={c} />;
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
                return <TesterMessagesItemButton quickReply key={i} item={v} />;
              })}
            </TesterSlide>
          </div>
        );
    }
  };
  return <>{itemType ? <>{itemType()}</> : null}</>;
};
