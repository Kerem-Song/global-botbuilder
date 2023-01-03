import { CARD_TYPES, IMessageType, IProductCardContent } from './BotTester';
import { TesterSlide } from './TesterSlide';

export interface TesterMessagesItemProps {
  item: IMessageType;
}

export const TesterMessagesItem = ({ item }: TesterMessagesItemProps) => {
  const itemType = () => {
    switch (item.type) {
      case CARD_TYPES.text:
        return (
          <>
            {item.isMe === true ? (
              <div className="send">
                <div className="sendMessage">{item.value}</div>
              </div>
            ) : (
              <div className="reply">
                <div className="replyMessage">{item.value}</div>
              </div>
            )}
          </>
        );
      case CARD_TYPES.productCardCarousel:
        return (
          <div className="productCardContainer">
            {item.contents.length === 0 ? null : (
              <TesterSlide gapSize={10}>
                {item.contents.map((c, i) => {
                  const content = c as IProductCardContent;
                  return (
                    <div key={i} className="productCard">
                      <img
                        className="productCardImg"
                        src={content.image?.imageUrl}
                        alt="productCardCarouselImg"
                      />
                      <div className="productCardContents">
                        <div className="productCardTitle">
                          <div className="title">
                            <img className="icon" src={content.icon.url} alt="iconImg" />
                            <p className="name">{content.title}</p>
                          </div>
                        </div>
                        <div className="productCardPrices">
                          <div className="price">
                            <p className="currentPrice">
                              {content.price?.net
                                ?.toFixed(0)
                                ?.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                              {content.price?.symbol}
                            </p>
                            <p className="prevPrice">
                              {content.price?.gross
                                ?.toFixed(0)
                                ?.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                              {content.price?.symbol}
                            </p>
                          </div>
                          <div className="discount">
                            <p className="discountPrice">
                              {content.price?.discount
                                ?.toFixed(0)
                                ?.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                              {content.price?.symbol}↓
                            </p>
                          </div>
                        </div>
                        <div className="productContents">
                          <div className="productDesc">
                            <p className="desc">{content.description}</p>
                          </div>
                          <div className="productBtn">
                            {content.buttons?.map((v, i) => {
                              return (
                                <button key={i} className="btn">
                                  {v.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </TesterSlide>
            )}
          </div>
        );
      case CARD_TYPES.cardCarousel:
        return (
          <div className="cardCarouselContainer">
            {item.contents.length === 0 ? null : (
              <TesterSlide gapSize={10}>
                {item.contents?.map((c, i) => {
                  const content = c as IProductCardContent;
                  return (
                    <div key={i} className="cardCarousel">
                      <img
                        className="cardCarouselImg"
                        src={content.image?.imageUrl}
                        alt="cardCarouselImg"
                      />
                      <button className="cardCarouselBtn">
                        {content.buttons?.[0].label}
                      </button>
                    </div>
                  );
                })}
              </TesterSlide>
            )}
          </div>
        );
      case CARD_TYPES.card:
        return (
          <div className="basicCardContainer">
            {item.title ? (
              <>
                <img
                  className="cardImg"
                  src={item.image?.imageUrl}
                  alt="cardIncludeImage"
                />
                <div className="cardText">
                  <p className="cardTitle">{item.title}</p>
                  <p className="cardContentText">{item.contentText}</p>
                </div>
                <div className="cardBtnList">
                  {item.buttons?.map((v, i) => {
                    return (
                      <button key={i} className="cardBtn">
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="cardText">
                  <div className="cardContentText">{item.contentText}</div>
                </div>
                <div className="cardBtnList">
                  {item.buttons?.map((v, i) => {
                    return (
                      <button key={i} className="cardBtn">
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      case CARD_TYPES.productCard:
        return (
          <div className="productCardContainer">
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
                      return (
                        <div key={i} className="btn">
                          {v.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case CARD_TYPES.image:
        return (
          <div className="imageCardContainer">
            <img className="imageCardImg contain" src={item.imageUrl} alt="fullSizeImg" />
          </div>
        );
    }
  };
  return <>{itemType ? <>{itemType()}</> : null}</>;
};
