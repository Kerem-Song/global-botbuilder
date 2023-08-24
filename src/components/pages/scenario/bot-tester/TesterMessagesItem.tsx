import { imgNotFoundImg } from '@assets';
import { ITesterDataType, ITesterDebugMeta, TESTER_DATA_TYPES } from '@models';
import { SyntheticEvent } from 'react';

import { BasicCardCarouselType } from './BasicCardCarouselType';
import { BasicCardType } from './BasicCardType';
import { ListCardCarouselType } from './ListCardCarouselType';
import { ListCardType } from './ListCardType';
import { ProductCardCarouselType } from './ProductCardCarouselType';
import { ProductCardType } from './ProductCardType';
import { TesterMessagesItemButton } from './TesterMessagesItemButton';
import { TesterSlide } from './TesterSlide';
import { TextCardType } from './TextCardType';

export interface TesterProps {
  item: ITesterDataType;
  onClick: (debugMeta?: ITesterDebugMeta) => void;
  handleRefresh: () => Promise<void>;
}

export const TesterMessagesItem = ({ item, onClick }: TesterProps) => {
  const handleImgOnError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = imgNotFoundImg;
  };
  const itemType = () => {
    switch (item.type) {
      case TESTER_DATA_TYPES.text:
        return <TextCardType item={item} onClick={onClick} />;
      case TESTER_DATA_TYPES.card: {
        return (
          <BasicCardType
            item={item}
            onClick={onClick}
            handleImgOnError={handleImgOnError}
          />
        );
      }
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
                    <BasicCardCarouselType
                      key={i}
                      item={c}
                      contents={item.contents}
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
          <ListCardType
            item={item}
            onClick={onClick}
            handleImgOnError={handleImgOnError}
          />
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
          <ProductCardType
            item={item}
            onClick={onClick}
            handleImgOnError={handleImgOnError}
          />
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
