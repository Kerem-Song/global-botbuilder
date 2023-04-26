import { Divider } from '@components';
import { IListTypeCard } from '@models';
import { FC } from 'react';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface IListCardCarouselTypeProps {
  item: IListTypeCard;
}

export const ListCardCarouselType: FC<IListCardCarouselTypeProps> = ({ item }) => {
  return (
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
  );
};
