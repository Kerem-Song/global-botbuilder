import { ICarousel, ITesterDataType, ITesterDebugMeta, TESTER_DATA_TYPES } from '@models';

import { TesterSlide } from './TesterSlide';

export interface TestProps {
  item: ITesterDataType;
  onClick: (debugMeta?: ITesterDebugMeta) => void;
}

export const TesterMessagesItem = ({ item, onClick }: TestProps) => {
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
                  const content = c as ICarousel;
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
                  const content = c as ICarousel;
                  const carouselBtn = content.buttons && content.buttons?.[0];
                  const webLinkUrl =
                    carouselBtn.postback && carouselBtn.postback.webLinkUrl;
                  const handleOpenWebLink = () => {
                    if (webLinkUrl) {
                      window.open(webLinkUrl);
                    }
                  };
                  return (
                    <div key={i} className="cardCarousel">
                      <>
                        <img
                          className="cardCarouselImg"
                          src={content.image?.imageUrl}
                          alt="cardCarouselImg"
                        />
                        {webLinkUrl ? (
                          <button className="cardCarouselBtn" onClick={handleOpenWebLink}>
                            {carouselBtn.label}
                          </button>
                        ) : (
                          <button className="cardCarouselBtn">{carouselBtn.label}</button>
                        )}
                      </>
                    </div>
                  );
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
                return (
                  <button key={i} className="quickReply">
                    {v.label}
                  </button>
                );
              })}
            </TesterSlide>
          </div>
        );
    }
  };
  return <>{itemType ? <>{itemType()}</> : null}</>;
};
