import { Divider, Space } from '@components';
import { IListTypeCard } from '@models';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface IListCardCarouselTypeProps {
  item: IListTypeCard;
}

export const ListCardCarouselType: FC<IListCardCarouselTypeProps> = ({ item }) => {
  return (
    <div className="listCard">
      {item.header && (
        <div className="header">
          <span>
            <MultiClamp clamp={1} ellipsis={'...'}>
              {item.header.substring(0, 39)}
            </MultiClamp>
          </span>
        </div>
      )}
      {item.image?.imageUrl && (
        <img
          className={
            item.image.imageAspectRatio === 0
              ? 'listCardImg_rectangle'
              : 'listCardImg_square'
          }
          src={item.image?.imageUrl}
          alt="img"
        />
      )}
      <div className="listCardContents">
        {item.items.map((x, i) => {
          return (
            <div key={i}>
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
                  <img src={x.image?.imageUrl} alt="img" />
                </div>
              </div>
              {item.items.length - 1 === i ? <Space /> : <Divider />}
            </div>
          );
        })}
        {item.buttons.length > 0 ? (
          <div
            className={
              item.image?.imageAspectRatio === 0 ? 'rectangleImageBtn' : 'squareImageBtn'
            }
          >
            {item.buttons?.map((v, i) => {
              return <TesterMessagesItemButton key={i} item={v} />;
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};
