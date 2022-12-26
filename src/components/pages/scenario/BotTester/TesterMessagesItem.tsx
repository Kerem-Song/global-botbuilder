import { IMessageItem, IProductCardContent } from './BotTester';

export interface ITesterMessagesItemProps {
  item: IMessageItem;
}

export const TesterMessagesItem = ({ item }: ITesterMessagesItemProps) => {
  const itemType = () => {
    switch (item.type) {
      case 'text':
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
      case 'productCardCarousel':
        return (
          <div className="productCardCarouselContainer">
            {item.contents?.map((c, i) => {
              const content = c as IProductCardContent;
              return (
                <div key={i} className="productCardCarousel">
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
                            ?.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          {content.price?.symbol}
                        </p>
                        <p className="prevPrice">
                          {content.price?.gross
                            ?.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          {content.price?.symbol}
                        </p>
                      </div>
                      <div className="discount">
                        <p className="discountPrice">
                          {content.price?.discount
                            ?.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                            <div key={i} className="btn">
                              {v.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 'cardCarousel':
        return (
          <div className="cardCarouselContainer">
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
          </div>
        );
      case 'card':
        return <div className="cardContainer">{item.contentText}</div>;
    }
  };
  return <>{itemType ? <>{itemType()}</> : null}</>;
};
